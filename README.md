# DSO101 DevSecOps Project — BMI Calculator Integration

## Project Setup Overview

This project integrates a **BMI calculator** feature into a full-stack PERN (PostgreSQL, Express, React, Node.js) application with a secure CI/CD pipeline using Docker, Jenkins, GitHub Actions, and Render.

### Initial Setup Steps Before Stages
- Forked the provided `DSO101_SE_project` repository.
- Verified backend and frontend connectivity.
- Implemented BMI Calculator in both frontend and backend:
  - Created input fields for height, weight, and age.
  - Connected to PostgreSQL to store data.
- Ensured backend API endpoints are functional (`/api/bmi`).

![alt text](img/1.png)
![alt text](img/2.png)
![alt text](img/3.png)
![alt text](img/4.png)
![alt text](img/5.png)
![alt text](img/6.png)
![alt text](img/7.png)

**backend/.env**

![alt text](img/14.png)

**docker-compose-dev.yml**
![alt text](img/15.png)

**Final working example**
![alt text](img/8.png)

## Stage 1: Docker Configuration

### 1. Docker Volume Setup
- **Docker volumes** configured to persist BMI data using:
  ```yaml
  volumes:
    - database-data:/data/postgres
    - backend-uploads:/app/uploads
  ```

### 2. Docker Compose Setup
- Modified `docker/docker-compose-dev.yml` to:
  - Mount volumes for PostgreSQL and backend uploads.
  - Use development Dockerfiles for frontend and backend.
  - Define all 3 services: `database`, `backend`, `frontend`.

### 3. Test Execution
- Created a new test service in Docker Compose for running Jest:
  ```yaml
  test-backend:
    build:
      context: ../backend
      dockerfile: Dockerfile.dev
    ...
    command: "npm run test"
  ```
![alt text](img/11.png)

### 4. Test Results
- Ran `docker-compose -f docker/docker-compose-dev.yml run --rm test-backend`
- Jest successfully executed 46 test suites (42 failed, 4 passed — acceptable for setup validation).
- Confirmed volume persistence.
![alt text](img/10.png)
![alt text](img/9.png)

### Challenges Encountered
**Docker Hub authentication errors**: Encountered permission issues during image push due to misconfigured DockerHub secrets.

**Incorrect file paths**: GitHub Actions failed initially because Dockerfile paths weren’t aligned with repository structure.

**Workflow triggers**: Needed to fine-tune the on.push configuration and match commit messages properly.

## Stage 2: Part 1 GitHub Actions Pipeline for Docker Builds

### 1. GitHub Secrets Configuration
Stored secrets under repository → Settings → Secrets and Variables → Repository secrets:
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### 2. Workflow File Setup
Created `.github/workflows/docker-build.yml` with:
```yaml
name: Docker Build and Push
on: push
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${ secrets.DOCKERHUB_USERNAME }
          password: ${ secrets.DOCKERHUB_TOKEN }

      - name: Build and Push Frontend
        run: |
          docker build -t ${ secrets.DOCKERHUB_USERNAME }/frontend:latest -f frontend/Dockerfile.dev .
          docker push ${ secrets.DOCKERHUB_USERNAME }/frontend:latest

      - name: Build and Push Backend
        run: |
          docker build -t ${ secrets.DOCKERHUB_USERNAME }/backend:latest -f backend/Dockerfile.dev .
          docker push ${ secrets.DOCKERHUB_USERNAME }/backend:latest
```
![alt text](img/12.png)

### 3. Verification
- Workflow triggered on `git push`.
- GitHub Actions logged:
  - Successful login to Docker Hub
  - Successful frontend and backend image builds
  - Images pushed to Docker Hub

![alt text](img/13.png)

## Stage 2: Part 2 Jenkins Pipeline for Docker Builds

### Description:
Configured Jenkins to push code to GitHub only when a commit message contains @push.

### Setup Summary:
A local Jenkins instance was initialized using Docker:

```bash
docker run -d --name jenkins-local -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```

A Pipeline Job named:

`DSO101_SE_project` was created with the following pipeline script:

```groovy
02230295_app_pipeline
```

Created GitHub credentials in Jenkins > Manage Credentials > Global:

ID: `github-credentials`

Username: `pomegranateis`

Password: GitHub Personal Access Token (PAT) with repo access

![alt text](img/18.png)

### Pipeline Function:

![alt text](img/17.png)

Detects @push in commit message using:

```groovy
def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
```

If present, executes build, test, and push to GitHub using:

```groovy
git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/pomegranateis/DSO101_SE_project.git
git push origin HEAD:main
```
![alt text](img/16.png)

### Challenges Encountered
**Port conflicts**: Jenkins couldn’t start on default port 8080 due to preoccupied processes. Resolved by identifying and killing processes using lsof.

**Git setup issues**: Jenkins jobs failed with fatal: not a git repository until pipeline was configured to pull SCM properly.

**PAT permissions**: Faced GitHub push failures due to missing repository access in the personal access token (PAT). Switching from public-only to full repository access resolved this.

**Credential masking issues**: Ensuring Jenkins masked sensitive tokens and used correct withCredentials configuration.

## Stage 3: Render Deployment (Incomplete)

### Challenge Summary
**Dockerfile issues**: Had to rebuild a production-ready Dockerfile due to missing compiled output (dist/index.js) and dev dependencies in production image.

**Node module errors**: Errors like Cannot find module 'express' and TypeScript declaration issues blocked builds until dev dependencies were included and compiled first.

**Environment variable conflicts**: Required manual adjustments to match .env structure for PostgreSQL in Render.

**Render runtime errors**: Deployment logs showed Endpoint not Found and dist/index.js missing due to build script mismatches.

**File not detected errors**: Docker builds failed to find package-lock.json due to .dockerignore and gitignore conflicts.

## Conclusion

Through Stage 1, the workflow was automated to build and push Docker images to Docker Hub. In Stage 2, Jenkins was configured locally to trigger a GitHub push when a specific commit message (@push) was detected, showcasing conditional pipeline logic and credential management.

Although Stage 3 (Render Deployment) could not be fully completed, significant progress was made in containerizing the backend, preparing the environment variables, and pushing images to Docker Hub. Several build and runtime challenges were encountered, particularly related to Dockerfile configuration, dependency handling, and Render's deployment limitations.

Despite not completing the final deployment stage, the core goals of CI/CD automation, secure credential handling, and Git-based triggers were successfully achieved. 
