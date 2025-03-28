import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import Footer from './Navbar/Footer';
import GetProductsByID from './Components/GetProductsByID';
import Home from './Pages/Home';
import Login from './Components/Login';
import Profile from './Components/Profile';
import ProductDetails from './Components/ProductDeatils';
import Search from './Pages/Search';
import WishlistProducts from './Pages/WishlistProducts';
import AllProducts from './Pages/AllProducts';
import SignUp from './Components/SignUp';
import About from './Pages/About';
import Contact from './Pages/Contact';
import EditProfile from './Components/EditProfile';
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import Orders from './Pages/Orders';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import AdminNavbar from './Admin/AdminNavbar';
import ManageUser from './Admin/ManageUser';
import ManageProducts from './Admin/ManageProducts';
import EditProduct from './Admin/EditProduct';
import AddProducts from './Admin/AddProducts';
import ManageOrders from './Admin/ManageOrders';
import AdminProfile from './Admin/AdminProfile';

function App() {
  return (
    <div >
      <Routes>
        {/* User Routes with Navbar and Footer */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/signup" element={
          <>
            <Navbar />
            <SignUp />
            <Footer />
          </>
        } />
        <Route path="/profile" element={
          <>
            <Navbar />
            <Profile />
            <Footer />
          </>
        } />
        <Route path="/products/:category" element={
          <>
            <Navbar />
            <GetProductsByID />
            <Footer />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Navbar />
            <ProductDetails />
            <Footer />
          </>
        } />
        <Route path="/search" element={
          <>
            <Navbar />
            <Search />
            <Footer />
          </>
        } />
        <Route path="/wishlist" element={
          <>
            <Navbar />
            <WishlistProducts />
            <Footer />
          </>
        } />
        <Route path="/all-products" element={
          <>
            <Navbar />
            <AllProducts />
            <Footer />
          </>
        } />
        <Route path="/about" element={
          <>
            <Navbar />
            <About />
            <Footer />
          </>
        } />
        <Route path="/contact" element={
          <>
            <Navbar />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/edit-profile" element={
          <>
            <Navbar />
            <EditProfile />
            <Footer />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <Cart />
            <Footer />
          </>
        } />
        <Route path="/order" element={
          <>
            <Navbar />
            <Order />
            <Footer />
          </>
        } />
        <Route path="/orders" element={
          <>
            <Navbar />
            <Orders />
            <Footer />
          </>
        } />

        {/* Admin Routes without Navbar and Footer */}
        <Route path="/admin-login" element={
          <>
          
          <AdminLogin />
          {/* <Footer/> */}
          </>
         } />
        <Route path="/admin-dashboard" element={
          <>
          <AdminDashboard />
          {/* <Footer /> */}
          </>
          
        } />
        <Route path="/manage-users" element={
          <>
          <ManageUser />
          {/* <Footer /> */}
          </>
          
          } />
        <Route path="/manage-products" element={
          <>
          <ManageProducts />
          {/* <Footer className="ml-65"/> */}
          </>
          
          } />
        <Route path="/edit-product/:id" element={
          <>
          <EditProduct />
          {/* <Footer /> */}
          </>
          
          } />
        <Route path="/add-product" element={
          <>
          <AddProducts />
          {/* <Footer /> */}
          </>
          
          } />
        <Route path="/manage-orders" element={
          <>
          <ManageOrders />
          {/* <Footer /> */}
          </>
          
          } />
        <Route path="/admin-profile" element={
          <>
          <AdminProfile />
          {/* <Footer /> */}
          </>
          
          } />
      </Routes>
    </div>
  );
}

export default App;
