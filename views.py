from django.shortcuts import render
from django.http import HttpResponse

def submit_property(request):
    if request.method == 'POST':
        # Process submitted form data
        title = request.POST['title']
        type = request.POST['type']
        description = request.POST['description']
        price = request.POST['price']
        location = request.POST['location']
        contact = request.POST['contact']
        images = request.FILES.getlist('images')
        
        # Save data or perform any desired action
        return HttpResponse('Property submitted successfully!')

    return render(request, 'submit_property.html')

# Create your views here.
def home(request):
    return render(request, 'home.html')

def services(request):
     return render(request, 'services.html')
 
def properties(request):
     return render(request, 'properties.html')
 
def contact(request):
    return render(request, 'contact.html')