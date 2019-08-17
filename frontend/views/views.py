from django.views.generic import TemplateView
from django.shortcuts import render_to_response
from django.shortcuts import render, reverse
from django.views import View
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model


import json

# Create your views here.

from company_assets.models import Asset

User = get_user_model()

# index view


class IndexView(TemplateView):
    template_name = 'index.html'


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
        print(password)
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


class SignUpView(View):
    ''' sign up '''

    def post(self, request):
        data = json.loads(self.request.body)
        print(data)

        try:
            user = User.objects.create_user(email=data['email'], password=data['password'], 
                                            first_name=data['first_name'], last_name=data['last_name'], 
                                            is_employee = True)
            return HttpResponse(200)
        except Exception as e:
            print(e.message)
            return HttpResponse(418)
