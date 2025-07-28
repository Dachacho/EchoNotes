from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

class Note(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255, blank=True)
    content=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)