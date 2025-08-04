# EchoNotes

EchoNotes is a **work-in-progress** personal knowledge management app inspired by [Obsidian](https://obsidian.md/).  
It is built with React (frontend) and Django REST Framework (backend).

---

## Features

- Workspace and folder organization
- Note creation and editing with Markdown support
- Tagging notes
- Sidebar navigation
- Basic search and filtering

---

## Planned Features / Roadmap (if everything went perfectly)

- **Full tag management:** create, edit, and delete tags; assign tags to notes by name
- **Tag search:** filter notes by tag (both frontend and backend support)
- **Live sync:** real-time updates using Redis pub/sub and WebSockets (Django Channels)
- **Note autosave and collaborative editing**
- **Improved UI/UX:** collapsible folders, drag-and-drop, better navigation
- **Advanced search:** search by note content, title, and tags
- **User management:** registration, profiles, and sharing workspaces
- **Mobile-friendly design**
- **Performance improvements and bug fixes**

---

## Status

This project is currently **halfway done/on-hold** might take a brake
Feel free to fork, contribute, or suggest features!

---

## Getting Started

1. Clone the repo
2. Set up the backend:
   ```sh
   cd backend
   pip install django djangorestframework django-filter djangorestframework-simplejwt
   # If you want to use tags and live sync in the future:
   pip install channels channels_redis
   ```
3. Set up the frontend (`cd frontend && npm install`)
4. Run both servers and visit the app in your browser

---

## License

MIT
