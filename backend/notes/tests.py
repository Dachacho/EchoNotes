from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import Note, Folder, Tag

User = get_user_model()

class APICoverageTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass1')
        self.user2 = User.objects.create_user(username='user2', password='pass2')
        self.client.force_authenticate(user=self.user1)

    def test_folder_crud(self):
        # Create
        url = reverse('folder-list')
        response = self.client.post(url, {'name': 'Folder1'})
        self.assertEqual(response.status_code, 201)
        folder_id = response.data['id']
        # List
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        # Update
        url_detail = reverse('folder-detail', args=[folder_id])
        response = self.client.patch(url_detail, {'name': 'Folder1Renamed'})
        self.assertEqual(response.status_code, 200)
        # Delete
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 204)
        # Create parent folder
        response = self.client.post(url, {'name': 'ParentFolder'})
        self.assertEqual(response.status_code, 201)
        parent_id = response.data['id']
        # Create child folder with parent
        response = self.client.post(url, {'name': 'ChildFolder', 'parent': parent_id})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['parent'], parent_id)

    def test_tag_crud(self):
        url = reverse('tag-list')
        response = self.client.post(url, {'name': 'Tag1'})
        self.assertEqual(response.status_code, 201)
        tag_id = response.data['id']
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        url_detail = reverse('tag-detail', args=[tag_id])
        response = self.client.patch(url_detail, {'name': 'Tag1Renamed'})
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 204)

    def test_note_crud_and_relations(self):
        # Create folder and tag
        folder = Folder.objects.create(name='F', user=self.user1)
        tag = Tag.objects.create(name='T', user=self.user1)
        url = reverse('note-list')
        data = {'title': 'Note1', 'content': 'C', 'folder': folder.id, 'tags': [tag.id]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        note_id = response.data['id']
        # List
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        # Update
        url_detail = reverse('note-detail', args=[note_id])
        response = self.client.patch(url_detail, {'title': 'Note1Renamed'})
        self.assertEqual(response.status_code, 200)
        # Delete
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, 204)

    def test_user_isolation(self):
        # Create note as user1
        note = Note.objects.create(user=self.user1, title='N', content='C')
        # Switch to user2
        self.client.force_authenticate(user=self.user2)
        url = reverse('note-list')
        response = self.client.get(url)
        self.assertEqual(len(response.data['results']), 0)

    def test_unauthenticated_access(self):
        """Ensure unauthenticated users cannot access endpoints."""
        self.client.force_authenticate(user=None)
        url = reverse('note-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)
        response = self.client.post(url, {'title': 'X', 'content': 'Y'})
        self.assertEqual(response.status_code, 401)

    def test_create_with_invalid_data(self):
        """Test creating resources with missing/invalid fields."""
        url = reverse('note-list')
        # Missing title
        response = self.client.post(url, {'content': 'No title'}, format='json')
        self.assertEqual(response.status_code, 400)
        # Blank title
        response = self.client.post(url, {'title': '', 'content': 'No title'}, format='json')
        self.assertEqual(response.status_code, 400)
        # Invalid folder id
        response = self.client.post(url, {'title': 'T', 'content': 'C', 'folder': 9999}, format='json')
        self.assertEqual(response.status_code, 400)
        # Invalid tag id
        response = self.client.post(url, {'title': 'T', 'content': 'C', 'tags': [9999]}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_access_other_users_objects(self):
        """Ensure users cannot access or modify others' notes, folders, or tags."""
        # Create as user1
        folder = Folder.objects.create(name='F', user=self.user1)
        tag = Tag.objects.create(name='T', user=self.user1)
        note = Note.objects.create(user=self.user1, title='N', content='C', folder=folder)
        # Switch to user2
        self.client.force_authenticate(user=self.user2)
        # Try to get, update, delete user1's note
        url = reverse('note-detail', args=[note.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        response = self.client.patch(url, {'title': 'Hacked'})
        self.assertEqual(response.status_code, 404)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
        # Try to access folder
        url = reverse('folder-detail', args=[folder.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        # Try to access tag
        url = reverse('tag-detail', args=[tag.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_nonexistent_resource(self):
        """Test accessing non-existent resources returns 404."""
        url = reverse('note-detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        response = self.client.patch(url, {'title': 'X'})
        self.assertEqual(response.status_code, 404)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)

    def test_folder_cannot_be_its_own_parent(self):
        """Test that a folder cannot be set as its own parent."""
        url = reverse('folder-list')
        response = self.client.post(url, {'name': 'LoopFolder'})
        folder_id = response.data['id']
        url_detail = reverse('folder-detail', args=[folder_id])
        response = self.client.patch(url_detail, {'parent': folder_id})
        self.assertEqual(response.status_code, 400)
