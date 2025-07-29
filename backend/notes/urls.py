from rest_framework import routers
from .views import NoteViewSet, FolderViewSet, TagViewSet

router = routers.DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = router.urls