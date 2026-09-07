# Voice of Narmada

Anonymous hostel concern/suggestion website.

## Stack
- HTML/CSS/JavaScript
- Supabase database + authentication
- GitHub for version control
- GitHub Pages (or another static host) for the website

## Local setup

1. Install Git and VS Code.
2. Create a Supabase project.
3. Run `supabase.sql` in Supabase SQL Editor.
4. Copy `config.example.js` to `config.js`.
5. Put your Supabase project URL and anon/publishable key in `config.js`.
6. Open `index.html` with a local server.

For example, with Python:
```bash
python3 -m http.server 5500
```
Then open:
http://localhost:5500

## Admin

Create an admin user in Supabase Authentication, then open:
`admin.html`

## Important privacy note

This starter form does not ask for names, phone numbers, room numbers, or logins.

However, "anonymous" should not be treated as a guarantee of perfect anonymity. Hosting providers, browsers, networks, and database infrastructure can have logs. Before using this publicly for sensitive complaints, review the privacy settings and move status lookup to a server-side/RPC design.

Never put a Supabase `service_role` key in the frontend or GitHub repository.
Only use the public/anon key in `config.js`.
