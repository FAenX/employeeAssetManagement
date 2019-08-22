from django.views.generic import TemplateView
from django.shortcuts import render_to_response
from django.shortcuts import render, reverse
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.core import serializers
import json
from django.db import transaction

# Create your views here.
from company_assets.models import Asset
from users.models import EmployeeProfile

#get user model
User = get_user_model()


class EmployerDashboardView(TemplateView):
    template_name = 'employer_dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        employees = User.objects.filter(is_employee=True)
        assets = Asset.objects.all()
        context['employees'] = employees
        context['assets'] = assets
        return context


# accounts
class LoginView(View):
    ''' login '''

    def post(self, request):
        data = json.loads(self.request.body)
        email = data['email']
        password = data['password']
        user = authenticate(email=email, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return HttpResponse(200)
            else:
                return HttpResponse("Your account was inactive.")
        else:
            print("Someone tried to login and failed.")
            print("They used username: {} and password: {}".format(email, password))
            return HttpResponse("Invalid login details given")

#logout view
class logoutView(View):
    '''logout view'''
    def get(self, request):
        logout(self.request)
        return HttpResponse('200')

#sign up view
class CreateEmployee(View):
    ''' sign up '''
    @transaction.atomic
    def post(self, request):
        data = json.loads(self.request.body)
        print(data)
        print(self.request.user.id)

        try:
            user = User.objects.create_user(email=data['email'], password=data['password'], 
                                            first_name=data['first_name'], last_name=data['last_name'], 
                                            is_employee = True)
            
            user_profile = EmployeeProfile.objects.get_or_create(user=user, created_by=self.request.user.id)
            print(user_profile)
            return HttpResponse(200)
        except Exception as e:
            print('Exception:', e)
            
            return JsonResponse(str(e), safe=False)

#employer sign up view
class CreateEmployer(View):
    ''' sign up '''
    @transaction.atomic
    def post(self, request):
        data = json.loads(self.request.body)
        print(data)
        print(self.request.user.id)

        try:
            user = User.objects.create_user(email=data['email'], password=data['password'], 
                                            first_name=data['first_name'], last_name=data['last_name'], 
                                            is_employer = True)
            
            return HttpResponse(200)
        except Exception as e:
            print('Exception:', e)
            
            return JsonResponse(str(e), safe=False)

class EmployeeApiView(View):
    def post(self, request):
        employee_id = json.loads(self.request.body)['employee_id']
        employee = User.objects.filter(id=employee_id)
        serialized_object = serializers.serialize('json', employee)
        print(type(serialized_object))
        return JsonResponse(serialized_object, safe=False)

class UserApiView(View):
    def get(self, request):
        return User
        

        
