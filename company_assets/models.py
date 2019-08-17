from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse

# Create your models here.

class Asset(models.Model):
        '''
        asset model class
        '''
        asset_name = models.CharField(_('Asset'), max_length=20)
        asset_description = models.CharField(_('Asset description'), max_length=200)
        slug = models.SlugField()
    
        #product absolute url
        def get_absolute_url(self):
            return reverse("detail", kwargs={"slug": self.slug})    
    
        # string representation of the product
        def __str__(self):
            return self.asset_name
    