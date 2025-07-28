from django.shortcuts import render
from rest_framework import viewsets
from .models import Note 
from .serializers import NoteSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)