from rest_framework import serializers
from .models import Note, Folder, Tag

class NoteSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Note 
        fields = ['id', 'user', 'title', 'folder', 'content', 'tags', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class FolderSerializer(serializers.ModelSerializer):
    def validate(self, data):
        parent = data.get('parent')

        if self.instance and parent and parent.id == self.instance.id:
            raise serializers.ValidationError({"parent": "A folder cannot be its own parent."})
        return data
    
    class Meta:
        model = Folder
        fields = ['id', 'name', 'user', 'parent']
        read_only_fields = ['id', 'user']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'user']
        read_only_fields = ['id', 'user']