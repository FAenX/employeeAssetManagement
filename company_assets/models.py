from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Asset(models.Model):
        '''
        asset model class
        '''
        asset_name = models.CharField(_('Asset'), max_length=20)
        asset_description = models.CharField(_('Asset description'), max_length=200)
        slug = models.SlugField()
    
        # string representation of the product
        def __str__(self):
            return self.asset_name

class AssetInstance(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.SET_NULL, null=True)
    availability = models.BooleanField(default=False)
    asset_number = models.CharField(_('Asset/Asset Number'), max_length=20)

    class Meta:
        ordering = ['availability']

    def __str__(self):
        return f'{self.asset.asset_name} {self.asset_number}'

class AssetManagement(models.Model):
    given_to = models.ForeignKey(User, on_delete=models.CASCADE)
    asset_instance = models.ForeignKey(AssetInstance, on_delete=models.CASCADE)
    date_given = models.DateTimeField()
    date_expezted_back = models.DateTimeField()

    def __repr__(self):
        return f'{self.asset_instance}'
    