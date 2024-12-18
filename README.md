# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance

## Solution - Key Concepts

### 1. Data Integrity Verification
- The backend generates a cryptographic hash (SHA-256) for the data each time it is updated.
- The `verify` endpoint allows the client to send its current data, and the server compares its hash to the stored hash to ensure the data has not been tampered with.

### 2. State History for Recovery
- A `history` array on the backend stores all previous valid states of the data.
- Before any update, the current state (data and hash) is saved into the `history` array. This ensures that every prior valid state is preserved.

### 3. Recover Functionality
- The `recover` endpoint allows the application to restore the data to its last valid state.
- The recovery process looks at the most recent valid state in the `history` array and returns the state if present. This ensures the system can roll back to the previous valid state as needed.

## Solution - How It Works

### Data Updates
When a user updates the data, a new cryptographic hash is created and pushed into `history`. The last object in the array serves as the most recent valid state.

### Verification
The application uses the `verify` endpoint to check the integrity of the data. By hashing the client-sent data and comparing it with the server-stored hash, any tampering can be detected.

### Recovery
When recovery is triggered:
1. The backend checks if the `history` array has at least one saved state.
2. It **peeks** at the last state in the `history` array without removing it.
3. The database is restored to this last valid state (data and hash), ensuring the data is rolled back.
4. Since the `history` array remains unchanged, recovery can be triggered multiple times without affecting the previous states.

If no historical states exist (empty `history`), the system returns a "History is empty" error message. This design ensures recovery is always safe, repeatable, and avoids data loss.

---

This solution is simple, lightweight, and ensures the integrity of the data while providing a robust mechanism for recovering lost or tampered data. This solution has limitations when it comes to scalability and security, as it relies solely on the integrity of the hash stored in the database.