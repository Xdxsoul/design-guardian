## 🧵 Project: Design Guardian
#### "Your design, your property"
##### Hackathon: WCHL25
---

### 🔍 Problem Statement
Fashion designers face critical challenges in protecting and monetizing their creations:

✂️ Plagiarism and unauthorized use: There is no simple, global way to prove authorship or ownership over fashion designs.

🌍 No traceability or authentication: Without verified records, proving authenticity or origin is hard, undermining trust in digital transactions.

🧵 Disconnected digital-physical market: Traditional e-commerce and fashion platforms aren't connected to digital IP tools.

💸 Limited monetization options: Independent creators face technical and financial obstacles to selling or licensing their patterns globally.

---

### 🎯 Goal
Empower fashion designers to create, protect, visualize and sell their work as verifiable digital assets, ensuring full control over their intellectual property and usage rights.
[Fashion show module](./goals/fashion_show.md)

---

### 💡 Proposed Solution
Design Guardian acts as a digital guardian of designers' rights, allowing them to **securely and easily** register their creations, as well as:

+ Design and save fashion designs on-platform.
+ View their design in a 3D simulator on garments.
+ Tokenize it as an **ICRC-7** NFT:
+ The public side of the NFT shows the **3D** rendering.
+ The private metadata contains original source files, only accessible to the NFT owner.
+ Publish or hide their NFTs in personal and global galleries.
+ Monetize through:
+ Direct sales
+ Bids
+ Usage licenses
+ Resales with built-in royalties

---

### 🧩 System Components
#### 🖼️ Frontend
+ Pattern editor

+ 3D pattern simulator

+ Global and personal NFT gallery

+ Login module (Internet Identity / Plug)

+ Design board

+ Tokenization settings (visibility, license, etc.)

#### 🔐 Backend (ICP Canisters)
+ User registration module

+ Private pattern storage

+ Publishing module

+ NFT minting module (ICRC-7)

  + Licensing & royalties engine

---

### 🔄 User Flows
#### 👩‍🎨 Designer
1. Registers.
2. Starts designing.
3. Saves work in progress.
4. Tokenizes their pattern.
5. Publishes NFT to gallery.
6. NFT shows in global gallery.
7. Can hide NFT anytime.

#### 🧍 Non-designer User
1. Registers.
2. Browses global gallery.
3. Views designer profiles.
4. Buys or bids on NFTs.
5. Gains access to source files after purchase.
6. Can resell NFT (royalties to creator/platform).

---

### 🧬 Main user data
+ Owner identity (Principal)
+ Nick Name (Public)
+ Optional email (private)
+ Optional Phone (private)
+ Followeds (settable privacy)
+ Followers (settable privacy)
+ General setting

---

### ⚙️ Tech Stack (100% ICP)
#### Component	Technology
+ Backend	ICP Canisters (Motoko/Rust)
+ NFT	ICRC-7
+ Frontend	React
+ Authentication	Internet Identity / Plug / NFID
+ Storage	On-chain (ICP)
+ 3D Rendering	WebGL / Three.js

