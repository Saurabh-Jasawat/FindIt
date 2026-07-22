# FindIt – From Lost to Found 📌

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> **Tagline**: *From Lost to Found.*  
> A community-driven Lost & Found platform designed to connect people with their lost belongings through a clean, centralized, and user-friendly web application.

---

## 📌 Project Overview
**FindIt – From Lost to Found** is a full-stack web application that helps people report, search, and recover lost or found items within a community, campus, or organization.

The application allows users to create Lost or Found item reports, browse community posts, search for items, filter results, update post details, and mark items as returned once they are successfully recovered.

The project is designed using **Layered Architecture** following industry-standard Spring Boot development practices while keeping the implementation simple, clean, and easy to understand for beginners.

---

## 🎯 Problem Statement
Every day, people lose important belongings such as:
- Mobile Phones
- Wallets
- ID Cards
- Documents
- Keys
- Bags
- Electronics

Most communities still rely on noisy WhatsApp groups or physical notices to report lost items, making the process slow, scattered, and unorganized. **FindIt** provides a centralized, dedicated platform where community members can report and search for lost or found items efficiently.

---

## 🚀 Objectives
- **Report Lost Items** & **Report Found Items**
- **Search Community Posts** in real time
- **Filter Items** dynamically
- **View Detailed Information** of reported items
- **Edit & Delete Posts**
- **Mark Items as Returned** once reunited

---

## 👨‍💻 Target Users
- College Students & Universities
- Offices & Coworking Spaces
- Apartments & Residential Societies
- Local Communities

---

## ✨ Features

### 1. Home Page
- View all Lost & Found posts in a single unified feed.
- Real-time search bar & filter chips.
- Visual badges (`🔴 LOST` / `🟢 FOUND` / `🟢 REUNITED`).

### 2. Report Item Form
Users can submit reports for Lost or Found items including:
- Title & Category
- Detailed Description
- Incident Location & Date
- Contact Name & 10-digit Phone Number
- Optional Image URL

### 3. Search & Filter Bar
- Search items using title, description, or location keywords.
- Filter posts by: Type (Lost/Found), Category, Status, and Location.

### 4. Item Details View
Displays complete information:
- Item image thumbnail
- Description & Category
- Date & Location
- Poster Contact Details with a direct **Call** link

### 5. My Posts Management Page
Users can view and manage their reported items:
- Edit post details
- Delete posts
- Toggle status between **Active** and **Returned** once reunited

---

## 🏗 Architecture & Request Flow

The project follows a strict 3-Tier Layered Architecture:

```
[ React UI (Vite) ]
        │
        ▼
   [ Axios ]
        │ (HTTP JSON Payload)
        ▼
[ REST Controller ]   <-- Request validation & mapping
        │
        ▼
 [ Service Layer ]    <-- Business logic & transaction boundaries
        │
        ▼
[ Repository Layer ]  <-- JPA / Hibernate ORM queries
        │
        ▼
 [ MySQL Database ]   <-- 'items' table
```

### Full Request-Response Loop
```
User ➔ React Components ➔ Axios ➔ REST API ➔ Controller ➔ Service ➔ Repository ➔ Hibernate ➔ MySQL ➔ Repository ➔ Service ➔ Controller ➔ JSON Response ➔ React UI
```

---

## 📂 Backend Architecture Design

### 1. Controller Layer (`ItemController.java`)
- **Responsibility**: Receiving HTTP Requests, validating the request payload, and returning standard JSON API responses.

### 2. Service Layer (`ItemService` & `ItemServiceImpl`)
- **Responsibility**: Encapsulating core business logic, managing transaction boundaries (`@Transactional`), and coordinating database calls.

### 3. Repository Layer (`ItemRepository.java`)
- **Responsibility**: Database communication and executing derived queries.

### 4. DTO Pattern (Data Transfer Object)
- Used to transfer data cleanly between the client and server without exposing database entities directly to the frontend.

### 5. Mapper Layer (`ItemMapper.java`)
- Handles type-safe conversions between DTOs and database Entities (`toEntity` / `toResponseDTO`).

### 6. Global Exception Handler (`GlobalExceptionHandler.java`)
- Centralized exception interception (`@RestControllerAdvice`) returning consistent structured error envelopes.

### 7. Bean Validation
- Enforces strict input validation on DTO fields.

---

## 📁 Project Structure

```
FindIt/
├── backend/                              # Spring Boot REST API
│   ├── pom.xml                           # Maven dependencies configuration
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── findit/
│       │   │           ├── FindItApplication.java        # Application Main Entry Point
│       │   │           ├── config/
│       │   │           │   └── WebConfig.java            # Centralized CORS Configuration (WebMvcConfigurer)
│       │   │           ├── controller/
│       │   │           │   └── ItemController.java       # REST Controller
│       │   │           ├── dto/
│       │   │           │   ├── ApiResponse.java          # Unified REST Envelope <T>
│       │   │           │   ├── ItemRequestDTO.java       # Bean Validation DTO
│       │   │           │   └── ItemResponseDTO.java      # Output JSON Payload
│       │   │           ├── entity/
│       │   │           │   ├── Category.java             # Enum: MOBILE, WALLET, KEYS, DOCUMENT, ID_CARD, BAG, ELECTRONICS, OTHER
│       │   │           │   ├── Item.java                 # JPA Entity
│       │   │           │   ├── ItemStatus.java           # Enum: ACTIVE, RETURNED
│       │   │           │   └── ItemType.java             # Enum: LOST, FOUND
│       │   │           ├── exception/
│       │   │           │   ├── ErrorDetails.java
│       │   │           │   ├── GlobalExceptionHandler.java# @RestControllerAdvice
│       │   │           │   └── ResourceNotFoundException.java
│       │   │           ├── mapper/
│       │   │           │   └── ItemMapper.java           # Entity ↔ DTO Converter Helper
│       │   │           ├── repository/
│       │   │           │   └── ItemRepository.java       # JpaRepository<Item, Long>
│       │   │           └── service/
│       │   │               ├── ItemService.java          # Service Interface
│       │   │               └── impl/
│       │   │                   └── ItemServiceImpl.java  # @Service & @Transactional Implementation
│       │   └── resources/
│       │       └── application.properties                # MySQL connection properties
│       └── test/
│           └── java/
│               └── com/
│                   └── findit/
│                       └── service/
│                           └── ItemServiceTest.java      # JUnit 5 & Mockito service unit tests
│
└── frontend/                             # React SPA
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── api/
        │   └── itemApi.js                # Axios REST API Client
        ├── assets/                       # Static media assets
        ├── components/
        │   ├── FilterBar.jsx             # Category, Location, Type & Status filter controls
        │   ├── ItemCard.jsx              # Individual post card
        │   ├── ItemStatusBadge.jsx       # Color badge
        │   ├── Navbar.jsx                # Header bar & navigation links
        │   └── SearchBar.jsx             # Real-time search bar
        ├── pages/
        │   ├── HomePage.jsx              # Main Feed page
        │   ├── ItemDetailPage.jsx        # Single post detail view page
        │   ├── MyPostsPage.jsx           # User's management page
        │   └── ReportItemPage.jsx        # Post creation & edit page
        ├── utils/                        # Utility helpers
        ├── App.jsx                       # React Router route configuration
        ├── main.jsx                      # Application bootstrap
        └── index.css                     # Tailwind CSS directives
```

---

## 🛠 Tech Stack

- **Backend**: Java 17+, Spring Boot 3, Spring MVC, Spring Data JPA (Hibernate), MySQL Connector, Lombok, Bean Validation.
- **Testing**: JUnit 5, Mockito, AssertJ.
- **Logging**: SLF4J (with `@Slf4j`).
- **Frontend**: React.js, Vite, React Router (v6), Axios, Tailwind CSS.
- **Build Tool**: Maven.

---

## 🗄 Database Schema (`items`)

A single table design in MySQL:

| Column Name | Data Type | Constraints / Annotations | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` (PK) | `@Id`, `@GeneratedValue(IDENTITY)` | Primary Key |
| `type` | `VARCHAR(20)` | `@Enumerated(EnumType.STRING)`, `@Column(nullable=false)` | `LOST` or `FOUND` |
| `title` | `VARCHAR(100)` | `@Column(nullable=false, length=100)` | Item Title |
| `description` | `TEXT` | `@Column(nullable=false, columnDefinition="TEXT")` | Detailed description |
| `category` | `VARCHAR(30)` | `@Enumerated(EnumType.STRING)`, `@Column(nullable=false)` | `MOBILE`, `WALLET`, `ID_CARD`, etc. |
| `location` | `VARCHAR(100)` | `@Column(nullable=false)` | Campus / organization location |
| `imageUrl` | `VARCHAR(500)` | `@Column(length=500)` | Image link |
| `date` | `DATE` | `LocalDate`, `@Column(nullable=false)` | Date of incident |
| `status` | `VARCHAR(20)` | `@Enumerated(EnumType.STRING)`, `@Column(nullable=false)` | `ACTIVE` or `RETURNED` |
| `contactName` | `VARCHAR(100)` | `@Column(nullable=false)` | Name of poster |
| `contactPhone`| `VARCHAR(20)` | `@Column(nullable=false)` | 10-digit contact number |
| `createdAt` | `DATETIME` | `@CreationTimestamp` | Creation audit timestamp |
| `updatedAt` | `DATETIME` | `@UpdateTimestamp` | Update audit timestamp |

---

## ✅ Bean Validation

Input payloads are strictly validated on the DTO layer using Jakarta Validation annotations:
- `@NotBlank`: Enforces that text inputs cannot be empty or null.
- `@NotNull`: Validates presence of objects like Enums and LocalDate.
- `@Size(min = 3, max = 100)`: Restricts field lengths (e.g. title lengths).
- `@Pattern(regexp = "^[0-9]{10}$")`: Ensures phone numbers are exactly 10-digit numbers.

---

## 📡 REST API Documentation

### Endpoints

| Method | Endpoint | Description | Request Body | Success Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | List & filter feed posts | None | `200 OK` |
| `GET` | `/api/items/{id}` | Get item details by ID | None | `200 OK` |
| `POST` | `/api/items` | Create new post | `ItemRequestDTO` | `201 Created` |
| `PUT` | `/api/items/{id}` | Replace post details | `ItemRequestDTO` | `200 OK` |
| `PATCH` | `/api/items/{id}/status` | Update item status (e.g. Returned) | None (Query parameter) | `200 OK` |
| `DELETE`| `/api/items/{id}` | Remove post | None | `204 No Content` |

### Unified Success Response Structure (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Item created successfully.",
  "data": {
    "id": 1,
    "title": "Lost Wallet"
  },
  "timestamp": "2026-07-22T12:30:15"
}
```

### Unified Exception Response Structure (`ErrorDetails`)
```json
{
  "success": false,
  "message": "Item post not found with id: 99",
  "timestamp": "2026-07-22T13:20:45"
}
```

---

## 📝 Logging Strategy (SLF4J)
The project utilizes **SLF4J** for structured logging:
- Tracks API operations.
- Records successful updates and deletes.
- Logs warnings (e.g., when an item is not found in database).

---

## 🧪 Testing Suite (JUnit 5 & Mockito)
Unit tests validate the Service layer workflow. Mocks isolate repository behavior so tests run instantly without needing database connections.
- **Service methods tested**: Create Item, Get Item, Update Item, Delete Item, Update Status, and Exception Handling.

---

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+ Installed
- MySQL Server running on `localhost:3306`
- Node.js & npm installed

### 2. Backend Setup
```bash
cd backend
# Database credentials configuration in backend/src/main/resources/application.properties
mvn clean spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## 🧪 Verification & Testing Commands
- **Backend Build & Compile**: `mvn clean compile`
- **Run Unit Tests**: `mvn test`
- **Frontend Production Build**: `npm run build`

---

## 🔮 Future Enhancements
- JWT User Authentication & Profiles
- User Accounts
- Image Upload Integration (Cloudinary)
- Pagination & Sorting
- Admin Dashboard
- Email Notifications
- Real-Time Chat

---

## 📚 What I Learned
Through this project, I gained practical experience in:
- Designing and implementing **Layered Architecture**.
- Building **RESTful APIs** using **Spring Boot**.
- Working with **Spring Data JPA (Hibernate)**.
- Implementing input validation and centralized exception handling.
- Writing unit tests using **JUnit 5** and **Mockito**.
- Building responsive React SPAs using **Tailwind CSS**.
- Managing code using **Git & GitHub**.

---

## 🎯 Interview Highlights
This project demonstrates practical knowledge of:
- Core **Java** & OOP principles
- **Spring Boot & Spring MVC** RESTful APIs
- **JPA & Hibernate** DB operations
- **React** components, Hooks, and client-side routing
- **Logging** & **Testing** best practices

---

## 📸 Screenshots
- **Home Page**: `[ Screenshot Placeholder ]`
- **Report Item Page**: `[ Screenshot Placeholder ]`
- **Item Details Page**: `[ Screenshot Placeholder ]`
- **My Posts Page**: `[ Screenshot Placeholder ]`

---

## 📜 License
This project is licensed under the MIT License - built for educational purposes and portfolio demonstration.
