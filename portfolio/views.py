"""
portfolio/views.py
All page views for the portfolio.
"""

from django.views.generic import TemplateView, ListView, DetailView, FormView
from django.urls import reverse_lazy
from django.contrib import messages

from .models import (
    Profile, Service, Stat, Skill, Project,
    Experience, Education,
)
from .forms import ContactForm


class HomeView(TemplateView):
    """Home page with all main sections."""
    template_name = 'portfolio/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['profile'] = Profile.objects.first()
        context['services'] = Service.objects.all()
        context['stats'] = Stat.objects.all()
        context['skills'] = Skill.objects.all()
        context['experiences'] = Experience.objects.order_by('-start_date')
        context['educations'] = Education.objects.order_by('-start_date')
        context['featured_projects'] = Project.objects.filter(featured=True)[:6]
        return context


class ProjectListView(ListView):
    """All projects."""
    model = Project
    template_name = 'portfolio/projects.html'
    context_object_name = 'projects'
    ordering = ['-created_at']


class ProjectDetailView(DetailView):
    """Single project details."""
    model = Project
    template_name = 'portfolio/project_detail.html'
    context_object_name = 'project'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'


class ContactView(FormView):
    """Contact form page."""
    template_name = 'portfolio/contact.html'
    form_class = ContactForm
    success_url = reverse_lazy('portfolio:contact')

    def form_valid(self, form):
        form.save()
        messages.success(self.request, "Thanks! Your message has been sent. I'll get back to you soon.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Please fix the errors below and try again.")
        return super().form_invalid(form)