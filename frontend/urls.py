from django.urls import path
from frontend.views import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name="login"),
    path('logout/', views.logoutView.as_view(), name='logout'),
    path('dashboard/', views.DashboardView.as_view(),
         name='dashboard'),

    #employer endpoints
    path('employer-signup/', views.CreateEmployer.as_view(), name='employer_signup'),

    #employee endpoints
    path('employee-info/', views.EmployeeView.as_view(), name='employee_info'),
    path('employee-signup/', views.CreateEmployee.as_view(), name="create_employee"),
    path('employee-assets/', views.EmployeeAssetsView.as_view, name='employee_assets'),
    
    ###activate account reverse
    path('activate/(<uidb64>[0-9A-Za-z_\-]+)/(<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/', views.Activate.as_view(), name='activate'),
    path('password-reset/', views.PasswordRest.as_view(), name="password_reset"),

]
