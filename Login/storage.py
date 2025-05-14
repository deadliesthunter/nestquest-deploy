# for profile picture change
import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings


class OverwriteStorage(FileSystemStorage):
    def get_available_name(self, name, max_length=None):
        # If the filename already exists, delete it.
        if self.exists(name):
            os.remove(os.path.join(self.location, name))
        return name
