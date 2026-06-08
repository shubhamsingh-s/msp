# Hostinger Migration Guide: Maa Sukriti Pharmaceuticals

This guide outlines the step-by-step instructions to migrate the **Maa Sukriti Pharmaceuticals** website, Express backend, and MySQL database from Vercel and TiDB Cloud to **Hostinger** (VPS or Business/Node.js Web Hosting).

---

## Migration Architecture Overview

```mermaid
graph TD
    A[Vercel (Frontend & Serverless)] -->|Migrate Code| B[Hostinger Node.js Server]
    C[TiDB Cloud (MySQL)] -->|Export/Import SQL| D[Hostinger MySQL Database]
    E[Cloudinary (Images)] -->|Keep Active| B
    F[User Browser] -->|Enquiry Request| B
    B -->|WhatsApp Trigger| G[WhatsApp API]
```

---

## Phase 1: Database Migration (TiDB to Hostinger MySQL)

### Step 1: Export Database from TiDB Cloud
1. Retrieve your TiDB connection details from the TiDB Cloud Console.
2. Run the following command locally or from a server to dump the schema and data into a file:
   ```bash
   mysqldump --host=<tidb-host> --port=4000 --user=<tidb-user> --password=<tidb-password> --ssl-mode=VERIFY_IDENTITY --ssl-ca=<ca-path> <tidb-database> > msp_database_backup.sql
   ```
   *(Alternatively, export the tables `categories`, `products`, `enquiries`, and `admins` via phpMyAdmin or any database client like DBeaver).*

### Step 2: Set Up MySQL on Hostinger
#### Option A: Hostinger VPS (Ubuntu)
1. Install MySQL Server:
   ```bash
   sudo apt update
   sudo apt install mysql-server -y
   ```
2. Secure the installation and set a root password:
   ```bash
   sudo mysql_secure_installation
   ```
3. Create the database and user:
   ```sql
   CREATE DATABASE msp_db;
   CREATE USER 'msp_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON msp_db.* TO 'msp_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Option B: Hostinger Shared/Business Hosting (hPanel)
1. Log in to your Hostinger hPanel.
2. Navigate to **Databases** > **MySQL Databases**.
3. Create a new MySQL database named `u123456789_msp` and a new database user. Record the generated database name, username, and password.

### Step 3: Import the SQL Dump
* **On VPS**:
  ```bash
  mysql -u msp_user -p msp_db < msp_database_backup.sql
  ```
* **On Shared Hosting**:
  1. Open phpMyAdmin from Hostinger hPanel.
  2. Select your newly created database.
  3. Click **Import**, choose `msp_database_backup.sql`, and click **Go**.

---

## Phase 2: Deploying the Node.js Application on Hostinger

### Option A: VPS Hosting (Recommended for performance and control)

#### 1. Server Environment Setup
Connect to your Hostinger VPS via SSH and install Node.js (Version 18+ or 20+ recommended) using Node Source:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:
```bash
node -v
npm -v
```

#### 2. Deploy Project Code
1. Clone the repository into your preferred folder (e.g. `/var/www/msp`):
   ```bash
   git clone https://github.com/shubhamsingh-s/msp.git /var/www/msp
   cd /var/www/msp
   ```
2. Install project dependencies:
   ```bash
   npm install --production
   ```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
nano .env
```
Populate the variables using your new Hostinger MySQL credentials and existing Cloudinary API keys:
```ini
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=msp_user
DB_NAME=msp_db
DB_PASSWORD=your_secure_password
DB_SSL=false

CLOUDINARY_CLOUD_NAME=dzmljvvyx
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

JWT_SECRET=your_jwt_secret_token
ADMIN_EMAIL=admin@mspbharat.com
```

#### 4. Configure Process Manager (PM2)
Install PM2 globally to keep the Node.js server running continuously:
```bash
sudo npm install -y -g pm2
```
Start the application using PM2:
```bash
pm2 start local-server.js --name "msp-app"
```
Ensure PM2 restarts automatically on server reboot:
```bash
pm2 startup
# Copy and run the command printed in the terminal
pm2 save
```

#### 5. Configure Nginx Reverse Proxy
Install Nginx:
```bash
sudo apt install nginx -y
```
Create a new server configuration block:
```bash
sudo nano /etc/nginx/sites-available/mspbharat.com
```
Add the following configuration, which proxies all dynamic routes to Node.js while letting Nginx serve static assets directly for maximum speed:
```nginx
server {
    listen 80;
    server_name mspbharat.com www.mspbharat.com;

    # Static Assets Cache Control
    location /assets/ {
        alias /var/www/msp/assets/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /css/ {
        alias /var/www/msp/css/;
        expires 7d;
    }

    location /js/ {
        alias /var/www/msp/js/;
        expires 7d;
    }

    # Proxy Sitemap & Robots to Node
    location = /sitemap.xml {
        proxy_pass http://localhost:3000/sitemap.xml;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location = /robots.txt {
        proxy_pass http://localhost:3000/robots.txt;
        proxy_set_header Host $host;
    }

    # Proxy All Pages & API Requests
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/mspbharat.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Setup SSL Certification (HTTPS)
Use Let's Encrypt (Certbot) to secure the site with a free SSL certificate:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d mspbharat.com -d www.mspbharat.com
```
Follow the interactive prompts to enable redirecting HTTP to HTTPS automatically.

---

### Option B: Hostinger Shared/Business Web Hosting (hPanel Node.js Application Router)

If your plan supports Node.js applications directly from hPanel:
1. Navigate to **Websites** > **Node.js** in hPanel.
2. Click **Create Application**.
3. Set the **Source Directory** to point to your uploaded codebase.
4. Set the **Application Startup File** to `local-server.js`.
5. Under **Environment Variables**, add the environment keys (same as Step 3 in VPS instructions above).
6. Click **Run NPM Install** in hPanel to load dependencies.
7. Click **Start App**.
8. Go to **SSL** in hPanel and install the lifetime SSL certificate for your domain name.

---

## Phase 3: Domain & Traffic Cutover

1. Once the Hostinger site is online, verify it using the VPS IP address or temporary domain name.
2. Log in to your Domain Registrar (e.g., GoDaddy, Namecheap, Hostinger).
3. Update the DNS Settings:
   * **A Record**: Point `@` to the Hostinger VPS IP address.
   * **CNAME Record**: Point `www` to your main domain name.
4. Reduce DNS TTL to `300` seconds before cutover to ensure minimal downtime.

---

## Phase 4: Final Validation Checklist

- [ ] **Home Page**: Verify title tags, meta descriptions, and GA4 scripts load in browser source (`Ctrl + U`).
- [ ] **Dynamic SEO**: Navigate to `/product-details?id=30001` (or any valid DB ID). Check that the dynamic SEO title and schemas are correctly loaded in the source.
- [ ] **Sitemap**: Verify `https://mspbharat.com/sitemap.xml` returns valid XML.
- [ ] **Robots.txt**: Verify `https://mspbharat.com/robots.txt` points to the correct sitemap location.
- [ ] **Cloudinary Uploader**: Log in to `/private-control-room/login`, add a test product, upload an image, and verify the image saves to Cloudinary.
- [ ] **WhatsApp Redirection**: Add a product to the cart, click "Enquiry Now", and check if it opens WhatsApp with the formatted cart item text.
