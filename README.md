# FindIt – From Lost to Found 📌

> **Tagline**: *From Lost to Found.*  
> A community-driven Lost & Found platform designed to connect people with their lost belongings through a clean, centralized, and user-friendly web application.

---

## 📌 Project Overview
Unlike traditional notice boards or noisy WhatsApp groups where information quickly gets buried, **FindIt** brings all Lost and Found reports together into a single, searchable community feed. Built as a Single Page Application (SPA) using **React** with a **Spring Boot REST API** backend, **MySQL** database, and structured service-layer testing.

---

## 🎯 Vision & Philosophy
> *"The best person to return a lost item is the one who found it. The best way to connect them is through one trusted community platform."*

To create a trusted platform where every lost belonging has a better chance of finding its way back to its rightful owner without middlemen or admin interventions.

---

## ❓ Problem Statement
Every day, students and community members lose valuable belongings like wallets, phones, keys, earbuds, ID cards, and calculators. Existing methods (WhatsApp groups, physical notice boards, social media) are scattered, temporary, and difficult to search. **FindIt** provides a centralized digital solution.

---

## 🔄 Application Flow

```
      Home Page (Community Feed)
                  │
                  ▼
         Search & Multi-Filter
                  │
                  ▼
             Item Details
                  │
                  ▼
         Report Lost/Found Item
                  │
                  ▼
               My Posts
                  │
                  ▼
     Edit / Delete / Mark Returned
```

---

## 💡 Key Features
- **Community Feed**: Displays all Lost (🔴) and Found (🟢) posts in a single unified feed.
- **Search & Multi-Filtering**: Real-time keyword search and filtering powered by Spring Data JPA derived query methods in `ItemRepository`.
- **Report Item Form**: Easy submission for Lost or Found items with image URL and 10-digit contact phone.
- **Item Details**: View complete description, formatted date (`LocalDate`), location, and poster phone number.
- **My Posts Management**: Edit own posts, delete posts, or toggle status to **Returned** once reunited via RESTful `PATCH`.
- **SLF4J Auditing**: Structured backend logs mapping the lifecycle of all user transactions.
- **Unit Testing Suite**: Robust test cases validating business workflows using JUnit 5 and Mockito.

---

## 💻 Tech Stack & Dependencies

### Backend
- **Java**: Version 17+
- **Framework**: Spring Boot 3 (Spring MVC, Spring Data JPA, Hibernate)
- **CORS Strategy**: Centralized CORS Configuration via `WebConfig.java` (no ad-hoc `@CrossOrigin` annotations on controllers)
- **Maven Dependencies**:
  - `spring-boot-starter-web`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-validation`
  - `mysql-connector-j`
  - `lombok` (with `@Slf4j` logger generator)
  - `spring-boot-devtools`
  - `spring-boot-starter-test` (JUnit 5, Mockito, AssertJ)
- **Database**: MySQL

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

---

## 🏗 Architecture Diagram

```
+-------------------------------------------------------------+
|                      React SPA (Vite)                       |
|           (HomePage, ReportPage, MyPostsPage, DetailPage)   |
+-------------------------------------------------------------+
                              │
                     (Axios in itemApi.js)
                              ▼
+-------------------------------------------------------------+
|                   Spring Boot REST API                      |
| Controller -> Service -> ItemMapper -> Repository (JPA)     |
+-------------------------------------------------------------+
                              │
                         (Hibernate)
                              ▼
+-------------------------------------------------------------+
|                        MySQL Database                       |
|                 ('items' with Column Indexes)               |
+-------------------------------------------------------------+
```

---

## 🗂 Project Structure

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
│       │   │           │   └── ItemController.java       # REST Controller (@RestController, @RequestMapping("/api/items"))
│       │   │           ├── dto/
│       │   │           │   ├── ApiResponse.java          # Unified REST Envelope <T>
│       │   │           │   ├── ItemRequestDTO.java       # Bean Validation DTO
│       │   │           │   └── ItemResponseDTO.java      # Output JSON Payload
│       │   │           ├── entity/
│       │   │           │   ├── Category.java             # Enum: MOBILE, WALLET, KEYS, DOCUMENT, ID_CARD, BAG, ELECTRONICS, OTHER
│       │   │           │   ├── Item.java                 # JPA Entity (@Table with @Index on type, status, category)
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
│       │   │                   └── ItemServiceImpl.java  # @Service & @Transactional Implementation with SLF4J
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
    ├── index.html
    └── src/
        ├── api/
        │   └── itemApi.js                # Axios REST API Client
        ├── assets/                       # Static media assets
        ├── components/
        │   ├── FilterBar.jsx             # Category, Location, Type & Status filter controls
        │   ├── ItemCard.jsx              # Individual post card
        │   ├── ItemStatusBadge.jsx       # Color badge (🔴 LOST / 🟢 FOUND / 🔵 RETURNED)
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

## 🗄 Database Schema (`items`)

Indexed Table Definition:
```sql
CREATE TABLE items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(30) NOT NULL,
    location VARCHAR(100) NOT NULL,
    image_url VARCHAR(500),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_category (category)
);
```

| Field | Datatype | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | Primary Key | Auto-generated ID |
| `type` | `ItemType` Enum | `@Column(nullable=false)` | `LOST` or `FOUND` |
| `title` | `String` | `@Column(nullable=false, length=100)` | Item Title |
| `description` | `String` | `@Column(nullable=false, columnDefinition="TEXT")` | Full Description |
| `category` | `Category` Enum | `@Column(nullable=false)` | Category |
| `location` | `String` | `@Column(nullable=false)` | Incident Location |
| `imageUrl` | `String` | `@Column(length=500)` | Image Link |
| `date` | `LocalDate` | `@Column(nullable=false)` | Incident Date |
| `status` | `ItemStatus` Enum | `@Column(nullable=false)` | `ACTIVE` / `RETURNED` |
| `contactName` | `String` | `@Column(nullable=false)` | Poster Name |
| `contactPhone`| `String` | `@Column(nullable=false)` | Phone Number |
| `createdAt` | `LocalDateTime` | `@CreationTimestamp`, `updatable=false` | Creation Timestamp |
| `updatedAt` | `LocalDateTime` | `@UpdateTimestamp` | Update Timestamp |

---

## 📡 REST API Documentation

### Endpoints
- `GET /api/items` - Fetch & filter all community items
  - **Example**: `GET /api/items?search=wallet&type=LOST&category=WALLET&location=Library&status=ACTIVE`
- `GET /api/items/{id}` - Fetch single item by ID
- `POST /api/items` - Report a new Lost or Found item (`201 Created`)
- `PUT /api/items/{id}` - Update item details (`200 OK` - Replaces complete resource)
- `PATCH /api/items/{id}/status?status=RETURNED` - Mark item as returned (`200 OK` - Partial status update)
- `DELETE /api/items/{id}` - Delete post (`204 No Content`)

### Unified Response Structure (`ApiResponse<T>`)
```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": { ... },
  "timestamp": "2026-07-21T18:20:15"
}
```

---

## 🖼 Screenshots Placeholder
> *(Screenshots to be added upon deployment)*

- **Home Page Feed**: `[ Screenshot Placeholder ]`
- **Report Item Form Page**: `[ Screenshot Placeholder ]`
- **Item Details Page**: `[ Screenshot Placeholder ]`
- **My Posts Page**: `[ Screenshot Placeholder ]`

---

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+ Installed
- MySQL Server running on `localhost:3306`
- Node.js & npm installed

### 2. Backend Setup
```bash
cd backend
# Database configuration in src/main/resources/application.properties:
# spring.datasource.url=jdbc:mysql://localhost:3306/findit_db?createDatabaseIfNotExist=true&useSSL=false
# spring.datasource.username=root
# spring.datasource.password=mysql23

mvn clean spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Verification & Testing
1. **Automated Compilation**: Run `mvn clean compile` in backend and `npm run build` in frontend.
2. **Backend Unit Testing**: Run `mvn test` in backend to execute the JUnit 5 and Mockito test suite.
3. **API Testing**: Verify all endpoints using Postman / cURL (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
4. **Database Verification**: Verify CRUD operations directly in MySQL Workbench / CLI after each API test.

---

## 🔮 Future Scope
- JWT Authentication
- User Accounts
- Image Upload
- Pagination
- Admin Dashboard

---

## 📜 License
MIT License. Built for education and portfolio demonstrations.
