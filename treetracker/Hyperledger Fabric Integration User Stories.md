
# 📘 Treetracker + Hyperledger Fabric Integration – User Stories

These user stories follow Jira's Agile format and are aligned with the integration roadmap.

---

## 🧱 EPIC 1: Blockchain Network Setup

### FAB-1: Set up Fabric network
- **As a** DevOps engineer  
- **I want to** set up a local Hyperledger Fabric test network with 2 organizations  
- **So that** we can develop and test blockchain transactions  
- **Acceptance Criteria**:
  - Two orgs are functional with peers and CA
  - Supports basic transactions  
- **Story Points**: 5

### FAB-2: Develop chaincode for tree capture
- **As a** blockchain developer  
- **I want to** write chaincode for `SubmitTreeCapture`, `VerifyCapture`, `IssueToken`  
- **So that** all tree planting data is stored immutably  
- **Acceptance Criteria**:
  - Functions created and tested  
- **Story Points**: 8

### FAB-3: Enroll blockchain users
- **As a** DevOps engineer  
- **I want to** configure CA and enroll planter/verifier identities  
- **So that** authenticated identities can interact with the blockchain  
- **Acceptance Criteria**:
  - Fabric identities for both orgs  
- **Story Points**: 3

---

## 🧱 EPIC 2: Middleware API

### MID-1: Build submit tree API endpoint
- **As a** backend developer  
- **I want to** create a REST API to accept tree data and send it to Fabric  
- **So that** the Android app can store tree data immutably  
- **Acceptance Criteria**:
  - Accepts metadata + hash, submits to Fabric  
- **Story Points**: 5

### MID-2: Integrate IPFS image storage
- **As a** backend developer  
- **I want to** store images in IPFS and return hashes  
- **So that** images are stored decentralized  
- **Acceptance Criteria**:
  - IPFS upload returns working hash  
- **Story Points**: 5

### MID-3: Create API for query + verification
- **As a** verifier  
- **I want to** query and verify tree captures  
- **So that** I can issue tokens  
- **Acceptance Criteria**:
  - API supports GET + verification  
- **Story Points**: 5

---

## 🧱 EPIC 3: Android App Refactor

### APP-1: Remove legacy backend components
- **As a** mobile developer  
- **I want to** remove Retrofit, Firebase, and AWS  
- **So that** the app only uses blockchain APIs  
- **Acceptance Criteria**:
  - Codebase is simplified and functional  
- **Story Points**: 3

### APP-2: Implement HLFAPI.kt
- **As a** mobile developer  
- **I want to** create API class for blockchain middleware  
- **So that** we can submit data to blockchain  
- **Acceptance Criteria**:
  - Tree data POST requests succeed  
- **Story Points**: 5

### APP-3: Generate image hash
- **As a** mobile developer  
- **I want to** hash tree images before upload  
- **So that** their integrity is preserved  
- **Acceptance Criteria**:
  - SHA-256 hashing works  
- **Story Points**: 3

### APP-4: Upload images to IPFS
- **As a** mobile developer  
- **I want to** upload images to IPFS via middleware  
- **So that** decentralized storage is used  
- **Acceptance Criteria**:
  - Image upload returns valid hash  
- **Story Points**: 3

### APP-5: Update DataSync logic
- **As a** mobile developer  
- **I want to** use blockchain for data sync  
- **So that** all captures are verified and logged immutably  
- **Acceptance Criteria**:
  - App syncs through Fabric  
- **Story Points**: 5

### APP-6: Display verified trees and tokens
- **As a** planter  
- **I want to** see my verified trees and tokens  
- **So that** I understand my contribution and rewards  
- **Acceptance Criteria**:
  - UI displays status + tokens  
- **Story Points**: 5

---

## 🧱 EPIC 4: Testing & Deployment

### TST-1: End-to-end blockchain test
- **As a** QA engineer  
- **I want to** test full tree → verify → token cycle  
- **So that** system reliability is ensured  
- **Acceptance Criteria**:
  - Data flows across all layers  
- **Story Points**: 5

### TST-2: Load test Fabric and middleware
- **As a** QA engineer  
- **I want to** test the system under heavy load  
- **So that** we can prepare for scaling  
- **Acceptance Criteria**:
  - 1,000+ simulated captures without crash  
- **Story Points**: 5

---
Proposal By: Imos Aikoroje @imos64
