import React from "react";
import { Routes, Route } from "react-router-dom";
import ForgotPassword from "../src/scenes/forgotPassword";
import VerifyPassword from "../src/scenes/verifyPassword";
// ...existing code...

<Routes>
  {/* ...existing routes... */}
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/verify-password" element={<VerifyPassword />} />
</Routes>
// ...existing code...