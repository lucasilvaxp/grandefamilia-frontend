# FastAPI + MongoDB Integration Guide

## Arquitetura

```
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│   Next.js       │─────▶│   FastAPI        │─────▶│   MongoDB    │
│   Frontend      │◀─────│   Backend        │◀─────│   Database   │
│   (Port 3000)   │      │   (Port 8000)    │      │              │
└─────────────────┘      └──────────────────┘      └──────────────┘
```

## FastAPI Backend Setup

### 1. Install Dependencies

```bash
pip install fastapi uvicorn motor pymongo python-dotenv pydantic
```

### 2. Environment Variables (.env)

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=fashion_catalog
FASTAPI_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### 3. FastAPI Project Structure

```
fastapi-backend/
├── main.py                 # FastAPI app entry point
├── database.py             # MongoDB connection
├── models.py               # Pydantic models
├── routes/
│   ├── products.py         # Product CRUD endpoints
│   └── categories.py       # Category endpoints
├── schemas/
│   ├── product.py          # Product schemas
│   └── category.py         # Category schemas
└── requirements.txt
```

### 4. Database Connection (database.py)

```python
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "fashion_catalog")

# Async MongoDB client for FastAPI
client = AsyncIOMotorClient(MONGODB_URL)
database = client[DB_NAME]

# Collections
products_collection = database.get_collection("products")
categories_collection = database.get_collection("categories")

async def get_database():
    return database
```

### 5. Product Model (models.py)

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Color(BaseModel):
    name: str
    hex: str

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    category: str
    subcategory: Optional[str] = None
    brand: str
    sizes: List[str]
    colors: List[Color]
    images: List[str]
    stock: int
    featured: bool = False
    tags: Optional[List[str]] = []
    rating: Optional[float] = None
    reviewCount: Optional[int] = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    brand: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[Color]] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None
    featured: Optional[bool] = None
    tags: Optional[List[str]] = None
    rating: Optional[float] = None
    reviewCount: Optional[int] = None

class Product(ProductBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
```

### 6. Product Routes (routes/products.py)

```python
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import Product, ProductCreate, ProductUpdate
from database import products_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=dict)
async def get_products(
    page: int = Query(1, ge=1),
    pageSize: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    brand: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = "newest"
):
    # Build filter query
    query = {}
    
    if category:
        query["category"] = category
    if subcategory:
        query["subcategory"] = subcategory
    if brand:
        query["brand"] = brand
    if featured is not None:
        query["featured"] = featured
    if minPrice or maxPrice:
        query["price"] = {}
        if minPrice:
            query["price"]["$gte"] = minPrice
        if maxPrice:
            query["price"]["$lte"] = maxPrice
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    # Sorting
    sort_options = {
        "price_asc": ("price", 1),
        "price_desc": ("price", -1),
        "newest": ("createdAt", -1),
        "popular": ("reviewCount", -1)
    }
    sort_field, sort_order = sort_options.get(sort, ("createdAt", -1))
    
    # Count total
    total = await products_collection.count_documents(query)
    
    # Pagination
    skip = (page - 1) * pageSize
    
    # Fetch products
    cursor = products_collection.find(query).sort(sort_field, sort_order).skip(skip).limit(pageSize)
    products = await cursor.to_list(length=pageSize)
    
    # Convert ObjectId to string
    for product in products:
        product["_id"] = str(product["_id"])
    
    return {
        "data": products,
        "total": total,
        "page": page,
        "pageSize": pageSize,
        "totalPages": (total + pageSize - 1) // pageSize
    }

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product = await products_collection.find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product["_id"] = str(product["_id"])
    return product

@router.post("/", response_model=Product, status_code=201)
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    product_dict["createdAt"] = datetime.utcnow()
    product_dict["updatedAt"] = datetime.utcnow()
    
    result = await products_collection.insert_one(product_dict)
    created_product = await products_collection.find_one({"_id": result.inserted_id})
    created_product["_id"] = str(created_product["_id"])
    
    return created_product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product: ProductUpdate):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    update_data = {k: v for k, v in product.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updatedAt"] = datetime.utcnow()
    
    result = await products_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
    updated_product["_id"] = str(updated_product["_id"])
    
    return updated_product

@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: str):
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    result = await products_collection.delete_one({"_id": ObjectId(product_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return None
```

### 7. Main FastAPI App (main.py)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import products, categories
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Fashion Catalog API",
    description="Backend API for Fashion E-commerce Catalog",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router)
app.include_router(categories.router)

@app.get("/")
async def root():
    return {
        "message": "Fashion Catalog API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("FASTAPI_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

## MongoDB Schema

### Products Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "price": Number,
  "originalPrice": Number (optional),
  "category": String,
  "subcategory": String (optional),
  "brand": String,
  "sizes": [String],
  "colors": [{
    "name": String,
    "hex": String
  }],
  "images": [String],
  "stock": Number,
  "featured": Boolean,
  "tags": [String],
  "rating": Number (optional),
  "reviewCount": Number,
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### Categories Collection

```json
{
  "_id": ObjectId,
  "name": String,
  "slug": String,
  "subcategories": [String],
  "image": String (optional)
}
```

## MongoDB Indexes (for performance)

```javascript
// Products indexes
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "featured": 1 });
db.products.createIndex({ "createdAt": -1 });
db.products.createIndex({ "name": "text", "description": "text", "tags": "text" });

// Categories indexes
db.categories.createIndex({ "slug": 1 }, { unique: true });
```

## Running the Stack

### 1. Start MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

### 2. Start FastAPI Backend
```bash
cd fastapi-backend
pip install -r requirements.txt
python main.py
# API available at http://localhost:8000
```

### 3. Start Next.js Frontend
```bash
# Set environment variable
echo "NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000" > .env.local

# Start dev server
bun dev
# Frontend available at http://localhost:3000
```

## Next.js Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

## API Testing

The FastAPI backend will be available at:
- Main API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

Test endpoints:
```bash
# Get all products
curl http://localhost:8000/api/products

# Get product by ID
curl http://localhost:8000/api/products/{id}

# Create product (POST)
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", ...}'
```

## Current Implementation

The Next.js app currently uses mock data in `/src/lib/mock-data.ts`. The API routes in `/src/app/api/` are ready to proxy requests to FastAPI. Once you set up the FastAPI backend, the integration will work automatically through the configured endpoints.
