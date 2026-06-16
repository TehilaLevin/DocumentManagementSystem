# Document Management System

A robust and scalable backend system for managing enterprise-grade documents, folders, and user permissions. The application is designed using a clean, layered architecture in .NET to ensure high maintainability, strict separation of concerns, and efficient data handling.

---

## Technical Stack

* **Language:** C#
* **Framework:** .NET Core / ASP.NET Core API
* **Architecture:** Layered Architecture (Separation of API, Business Logic, and Data Access)

---

## System Architecture

The project codebase is organized into dedicated layers to abstract core business functionality from data access and delivery:

* **SmartStore.API:** The entry point of the application, containing controllers, middleware, and API endpoints. It handles incoming HTTP requests and structures responses.
* **SmartStore.BLL (Business Logic Layer):** Houses the core system functions, processing logic, business rules, validation, and permission evaluations.
* **SmartStore.DAL (Data Access Layer):** Directs interaction with the underlying database, managing data retrieval, persistence, and storage operations.

---

## Core Features

* **Hierarchical File System:** Supports creating, renaming, and structuring files and folders within a multi-layered workspace directory.
* **Access & Permission Control:** Granular authorization system allowing users or administrators to assign, update, and revoke rights on specific folders and individual files.
* **Trash & Recovery Workflow:** Secure file deletion framework enabling users to move items to a trash repository, restore them, or perform permanent deletions.
* **User & Group Collaboration:** Capability to group users into structural units to manage shared access to document libraries seamlessly.
* **Version Control & Logging:** Basic audit logging mechanism to monitor document modifications and store structural changes over time.

---

## Getting Started

### Prerequisites
* .NET SDK (v6.0 / v8.0 or higher depending on environment)
* Visual Studio or Visual Studio Code

### Installation & Execution
1. Clone the repository to your local machine.
2. Open the solution file `SmartStore.sln` using Visual Studio.
3. Restore the required NuGet packages.
4. Update the database connection string located in the configuration files if necessary.
5. Build and run the `SmartStore.API` project to launch the local development server.
