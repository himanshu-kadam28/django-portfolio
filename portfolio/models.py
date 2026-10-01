"""
portfolio/models.py
Models for the portfolio website.
"""

from django.db import models
from django.utils.text import slugify


class Profile(models.Model):
    """Personal info shown on the home page and header."""
    name = models.CharField(max_length=100)
    headline = models.CharField(
        max_length=200,
        blank=True,
        help_text="Short tagline shown under your name (used in typing animation)."
    )
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=100, blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return self.name


class Service(models.Model):
    """Services / what you offer (e.g., Web Development, API Design)."""
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(
        max_length=50,
        default='fa-code',
        help_text="Font Awesome icon class (e.g., fa-code, fa-database, fa-paint-brush)."
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Stat(models.Model):
    """Animated counters (e.g., '50+ Projects', '5 Years Experience')."""
    label = models.CharField(max_length=100)
    value = models.PositiveIntegerField(default=0)
    suffix = models.CharField(max_length=10, blank=True, default='+')
    icon = models.CharField(max_length=50, default='fa-trophy')

    def __str__(self):
        return f"{self.value}{self.suffix} {self.label}"


class Skill(models.Model):
    """Skills shown with progress bars."""
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('tools', 'Tools & Others'),
    ]
    name = models.CharField(max_length=100)
    percentage = models.PositiveIntegerField(default=80)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='backend')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Project(models.Model):
    """Portfolio project."""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    short_description = models.CharField(max_length=250)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    technologies = models.CharField(
        max_length=200,
        help_text="Comma-separated (e.g., Django, PostgreSQL, Tailwind)"
    )
    link = models.URLField(blank=True)
    github_link = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def get_technologies_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]


class Experience(models.Model):
    """Work experience timeline."""
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField()
    current = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.position} @ {self.company}"


class Education(models.Model):
    """Education timeline."""
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class ContactMessage(models.Model):
    """Messages from the contact form."""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"