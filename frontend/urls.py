from django.urls import path
from frontend.views import views


urlpatterns = [
    path('login/', views.LoginView.as_view(), name="login"),
    path('logout/', views.logoutView.as_view(), name='logout'),
    path('employee-signup/', views.CreateEmployee.as_view(), name="create_employee"),
    path('employer-signup/', views.CreateEmployer.as_view(), name='employer_signup'),
    path('employer-dashboard/', views.EmployerDashboardView.as_view(),
         name='employer_dashboard'),
    path('employeeApi/', views.EmployeeApiView.as_view(), name='employee_api'),
    path('userApi/', views.UserApiView.as_view(), name='user_api'),

]
