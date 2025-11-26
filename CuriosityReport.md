# Curiosity Report 11-25-2025

## Prompt: uptime—what, how, and why?  

### Why is this topic relevant? 

While working on Deliverable #10, I came across the Upptime website. I was really excited by Grafana and its functionality, which made me curious about other ways to monitor my websites and check their performance. Discovering Upptime was especially interesting because it uses GitHub and is completely free. I wondered: how can something use GitHub to monitor a website automatically? This motivated me to connect it to our class project domain, pizza-jwt, to experiment with it firsthand.

---

## What is Upptime?

Upptime is an open-source uptime monitoring system that leverages **GitHub Actions** and **GitHub Pages** to automatically check the availability of websites and generate a public status page.

> “Upptime is the open-source uptime monitor and status page, powered entirely by GitHub — no servers required.”  
> — *[Upptime Documentation](https://upptime.js.org)*

Some of the most relevant uses of Upptime include:

- Continuously monitor websites, APIs, and online services using GitHub Actions.
- Automatically generate a beautiful, mobile-friendly public status page hosted on GitHub Pages.
- Track historical uptime, response times, and overall system performance.
- Automatically create GitHub Issues when a monitored site goes down.
- Leverage GitHub’s ecosystem — repositories, workflows, issues, and commits — without needing your own servers or external monitoring tools.

---

## How I connected Upptime to my websites

### 1. Create a Repository from the Template

Go to the [Upptime GitHub repository](https://github.com/upptime/upptime) and click **Use this template**, or click [this link](https://github.com/upptime/upptime/generate) to create a new repo from the template.

When creating the repository:

- Give it a repository name.
- Check **“Include all branches”**.
- Click **Create repository from template**.

---

### 2. Enable Workflows

1. Go to the **Actions** tab in your new repository.
2. Click the prompt to **Enable Workflows**.

This activates all the workflows included with Upptime.

---

### 3. Enable GitHub Pages (Optional)

To host a public status page:

1. Go to **Settings → Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. In the branch dropdown, select `gh-pages` and `/ (root)`.
4. Click **Save**.

After saving, you should see:  
*"Your site is live at ..."*

---

### 4. Add Repository Secrets

Upptime requires a **GitHub Personal Access Token (PAT)** with permissions for:

- Actions
- Contents
- Issues
- Workflows

Steps to create a PAT:

1. Go to **Settings → Developer settings → Personal access tokens**.  
2. Generate a **classic token** (not fine-grained). In my experience, fine-grained tokens caused errors, so make sure to allow `repo` and `workflow` access.
3. Copy the token **once** — you won’t see it again.  
4. Go to your repository: **Settings → Secrets and variables → Actions → New repository secret**.  
5. Name it `GH_PAT` and paste the token value.

This token allows Upptime to commit updates, build the site, and manage issues automatically.

---

### 5. Update Configuration (`.upptimerc.yml`)

Configure the websites you want to monitor and customize your status page. Here is an example configuration:

## 6. Commit your graph workflow: It is also improtant to notice that I had troubel for workflows keep failing to see my graph workfows. I learnt that apparantly sometimes you need to change something in the given file and than commit it in order for GitHUb to see it. It is a very wierd bug but sometimes it happens. can you polish it?


