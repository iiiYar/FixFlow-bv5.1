# Smartphone Repair Management System Documentation

## Page Structure
### Layout Components
1. Main Section
   - Responsive design with dark mode support
   - Maximum width container with padding
   - Shadow and rounded corners for content area

2. Action Bar
   - Search functionality
   - New Repair Request button
   - Filter and Export options

3. Repair Requests Table
   - Responsive table layout
   - Columns:
     - ID
     - Device (with image and category)
     - Customer
     - Mobile
     - Issue Type
     - Date
     - Status
     - Price
     - Notes
     - Actions

4. Modal Forms
   - Add/Edit repair request form
   - Pre-populated fields for editing
   - Form validation
   - Status update functionality

## Routes (routes_repair.py)
### Main Routes
1. `/smartphone-repair`
   - Displays main repair management page
   - Fetches all repairs, customers, and devices

2. `/repairs`
   - Lists all repair requests

3. `/add_repair`
   - Handles new repair request creation
   - Methods: GET, POST
   - Form processing and database operations

4. `/edit_repair/<int:repair_id>`
   - Manages repair request updates
   - Methods: GET, POST
   - Pre-populates form with existing data

5. `/delete_repair/<int:repair_id>`
   - Handles repair request deletion
   - Method: POST

6. `/update_repair_status/<int:repair_id>`
   - Updates repair status
   - Handles completion date setting

7. `/get_repair_details/<int:repair_id>`
   - Retrieves detailed repair information
   - Returns JSON response

## Models
### RepairRequest Model
- Fields:
  - id (Primary Key)
  - device_id (Foreign Key to Devices)
  - customer_id (Foreign Key to Customer)
  - issue_type (Enum)
  - repair_price (Numeric)
  - notes (Text)
  - status (Enum)
  - created_at (DateTime)
  - completed_at (DateTime)

### IssueType Enum
- Available Types:
  - Hardware Issues
  - Software Issues
  - Screen Replacement
  - Battery Replacement
  - Water Damage
  - Other

### RepairStatus Enum
- Status Options:
  - Pending
  - In Progress
  - Completed

## Features
1. Repair Request Management
   - Create new repair requests
   - Edit existing requests
   - Delete requests
   - View detailed information

2. Status Tracking
   - Real-time status updates
   - Visual status indicators
   - Automatic completion date tracking

3. Customer Integration
   - Customer information display
   - Contact details access
   - Customer history tracking

4. Device Management
   - Device details display
   - Category classification
   - Image support

5. UI/UX Features
   - Responsive design
   - Dark mode support
   - Modal forms
   - Real-time updates
   - Search functionality
   - Filtering options
   - Export capabilities

## Technical Specifications
1. Frontend
   - Tailwind CSS for styling
   - Flowbite components
   - JavaScript for dynamic interactions
   - Modal management
   - Form handling

2. Backend
   - Flask routing system
   - SQLAlchemy ORM
   - JSON API endpoints
   - Error handling
   - Database transactions

3. Security Features
   - CSRF protection
   - Input validation
   - Error logging
   - Safe database operations

## Future Enhancements
1. Advanced filtering system
2. Repair history tracking
3. Automated notifications
4. Payment integration
5. Service scheduling
6. Inventory management integration
7. Customer feedback system
8. Repair cost estimation
9. Technician assignment
10. Service warranty tracking