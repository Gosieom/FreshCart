"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  MapPin,
  Heart,
  Plus,
  Minus,
  Trash2,
  Star,
  Home,
  Grid3X3,
  Clock,
  ChevronRight,
  ChevronLeft,
  Tag,
  Leaf,
  Store,
  X,
  Package,
  HeartHandshake,
  Settings,
  HelpCircle,
  Apple,
  Play,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import "./dashboard.css";

type ViewType = "home" | "store" | "grocery" | "offers" | "category";

type StoreItem = {
  id: number;
  name: string;
  image: string;
  delivery: string;
  badge: string;
  category: string;
  hasOffer?: boolean;
};

type CategoryItem = {
  id: number;
  name: string;
  image: string;
};

type ProductItem = {
  id: number;
  name: string;
  image: string;
  qty: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  category: string;
};

type BannerItem = {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  variant: string;
  view: ViewType;
};

type AddressItem = {
  id: number;
  label: string;
  detail: string;
  shortLabel: string;
};

const savedAddresses: AddressItem[] = [
  {
    id: 1,
    label: "Basundhara, Kathmandu",
    detail: "Kathmandu 44600, Nepal",
    shortLabel: "Basundhara, Kathmandu",
  },
  {
    id: 2,
    label: "New Road",
    detail: "Kathmandu 44600, Nepal",
    shortLabel: "New Road, Kathmandu",
  },
  {
    id: 3,
    label: "Baneshwor",
    detail: "Kathmandu 44600, Nepal",
    shortLabel: "Baneshwor, Kathmandu",
  },
];

const banners: BannerItem[] = [
  {
    id: 1,
    title: "Today’s FreshCart offers",
    subtitle: "Save more on fruits, vegetables, dairy, bakery and grocery items.",
    buttonText: "View offers",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop",
    variant: "offers",
    view: "offers",
  },
  {
    id: 2,
    title: "Explore nearby stores",
    subtitle: "Shop from Fresh Mart, Green Basket, Daily Dairy and more.",
    buttonText: "View stores",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&auto=format&fit=crop",
    variant: "stores",
    view: "store",
  },
  {
    id: 3,
    title: "Shop all fresh items",
    subtitle: "Everything you need for your kitchen, delivered fresh and fast.",
    buttonText: "Shop all",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop",
    variant: "allshop",
    view: "grocery",
  },
];

const stores: StoreItem[] = [
  {
    id: 1,
    name: "Fresh Mart",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&auto=format&fit=crop",
    delivery: "By 12:30pm",
    badge: "No markups",
    category: "Grocery",
  },
  {
    id: 2,
    name: "Green Basket",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop",
    delivery: "20 min",
    badge: "Fresh items",
    category: "Vegetables",
  },
  {
    id: 3,
    name: "Fruit House",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop",
    delivery: "30 min",
    badge: "Rs. 50 off",
    category: "Fruits",
    hasOffer: true,
  },
  {
    id: 4,
    name: "Daily Dairy",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop",
    delivery: "By 1:00pm",
    badge: "Fresh dairy",
    category: "Dairy",
  },
  {
    id: 5,
    name: "Bakery Hub",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
    delivery: "45 min",
    badge: "15% off",
    category: "Bakery",
    hasOffer: true,
  },
  {
    id: 6,
    name: "Budget Store",
    image:
      "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&auto=format&fit=crop",
    delivery: "Today",
    badge: "Bulk pricing",
    category: "Grocery",
    hasOffer: true,
  },
];

const categories: CategoryItem[] = [
  {
    id: 1,
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Dairy",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&auto=format&fit=crop",
  },
];

const products: ProductItem[] = [
  {
    id: 1,
    name: "Fresh Apple",
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop",
    qty: "1 kg",
    price: "Rs. 160",
    oldPrice: "Rs. 180",
    discount: "Rs. 20 off",
    category: "Fruits",
  },
  {
    id: 2,
    name: "Banana",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop",
    qty: "1 dozen",
    price: "Rs. 120",
    category: "Fruits",
  },
  {
    id: 3,
    name: "Tomato",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop",
    qty: "1 kg",
    price: "Rs. 75",
    oldPrice: "Rs. 90",
    discount: "15% off",
    category: "Vegetables",
  },
  {
    id: 4,
    name: "Carrot",
    image:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=500&auto=format&fit=crop",
    qty: "1 kg",
    price: "Rs. 80",
    category: "Vegetables",
  },
  {
    id: 5,
    name: "Milk",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop",
    qty: "1 liter",
    price: "Rs. 100",
    oldPrice: "Rs. 110",
    discount: "Rs. 10 off",
    category: "Dairy",
  },
  {
    id: 6,
    name: "Fresh Bread",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
    qty: "1 packet",
    price: "Rs. 85",
    category: "Bakery",
  },
  {
    id: 7,
    name: "Orange Juice",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop",
    qty: "1 liter",
    price: "Rs. 199",
    oldPrice: "Rs. 220",
    discount: "10% off",
    category: "Drinks",
  },
  {
    id: 8,
    name: "Potato",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop",
    qty: "1 kg",
    price: "Rs. 70",
    category: "Vegetables",
  },
];

const getPriceNumber = (price: string) => {
  return Number(price.replace(/[^\d]/g, "")) || 0;
};

const formatNepaliPrice = (amount: number) => {
  return `Rs. ${amount}`;
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  const [activeView, setActiveView] = useState<ViewType>("home");
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeBanner, setActiveBanner] = useState(0);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<AddressItem>(
    savedAddresses[0]
  );
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<Record<number, number>>({});

  const currentUser = user as {
    name?: string;
    fullName?: string;
    email?: string;
  };

  const displayName =
    currentUser?.name ||
    currentUser?.fullName ||
    currentUser?.email?.split("@")[0] ||
    "Customer";

  const cartProducts = useMemo(() => {
    return products
      .map((product) => ({
        product,
        quantity: cartItems[product.id] || 0,
      }))
      .filter((item) => item.quantity > 0);
  }, [cartItems]);

  const totalCartItems = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const itemSubtotal = cartProducts.reduce((total, item) => {
    return total + getPriceNumber(item.product.price) * item.quantity;
  }, 0);

  const deliveryFee = cartProducts.length > 0 ? 50 : 0;
  const totalAmount = itemSubtotal + deliveryFee;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const searchedProducts = useMemo(() => {
    return products.filter((product) => {
      const text = searchText.toLowerCase();

      return (
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text)
      );
    });
  }, [searchText]);

  const filteredProducts = useMemo(() => {
    return searchedProducts.filter((product) => {
      return activeFilter === "All" || product.category === activeFilter;
    });
  }, [searchedProducts, activeFilter]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const text = searchText.toLowerCase();

      return (
        store.name.toLowerCase().includes(text) ||
        store.category.toLowerCase().includes(text) ||
        store.badge.toLowerCase().includes(text)
      );
    });
  }, [searchText]);

  const searchedAddresses = savedAddresses.filter((address) => {
    const text = addressSearch.toLowerCase();

    return (
      address.label.toLowerCase().includes(text) ||
      address.detail.toLowerCase().includes(text)
    );
  });

  const offerProducts = searchedProducts.filter((product) => product.discount);
  const offerStores = filteredStores.filter((store) => store.hasOffer);

  const handlePreviousBanner = () => {
    setActiveBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % banners.length);
  };

  const handleAddToCart = (productId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const increaseCartItem = (productId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const decreaseCartItem = (productId: number) => {
    setCartItems((prev) => {
      const currentQuantity = prev[productId] || 0;
      const updatedCart = { ...prev };

      if (currentQuantity <= 1) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = currentQuantity - 1;
      }

      return updatedCart;
    });
  };

  const removeCartItem = (productId: number) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveFilter(categoryName);
    setActiveView("category");
  };

  const handleBannerClick = (view: ViewType) => {
    setActiveView(view);

    if (view === "grocery" || view === "home") {
      setActiveFilter("All");
    }
  };

  const handleAddressSelect = (address: AddressItem) => {
    setSelectedAddress(address);
    setAddressSearch("");
    setIsAddressModalOpen(false);
  };

  const banner = banners[activeBanner];

  const renderStoreCards = (items: StoreItem[]) => (
    <div className="fc_store_row">
      {items.map((store) => (
        <button
          type="button"
          className="fc_store_item"
          key={store.id}
          onClick={() => {
            setActiveView("grocery");
            setActiveFilter("All");
          }}
        >
          <div className="fc_store_image">
            <img src={store.image} alt={store.name} />
          </div>

          <h3>{store.name}</h3>

          <p>
            <Clock size={15} />
            {store.delivery}
          </p>

          <mark>{store.badge}</mark>
        </button>
      ))}
    </div>
  );

  const renderCategoryCards = () => (
    <div className="fc_category_grid">
      {categories.map((category) => (
        <button
          type="button"
          key={category.id}
          onClick={() => handleCategoryClick(category.name)}
          className={activeFilter === category.name ? "selected" : ""}
        >
          <img src={category.image} alt={category.name} />
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );

  const renderProductCards = (items: ProductItem[]) => (
    <div className="fc_product_grid">
      {items.length === 0 ? (
        <div className="fc_empty_state">
          <h3>No products found</h3>
          <p>Try another search or category.</p>
        </div>
      ) : (
        items.map((product) => {
          const isLiked = likedProducts.includes(product.id);
          const quantity = cartItems[product.id] || 0;

          return (
            <article className="fc_product_card" key={product.id}>
              {product.discount && (
                <span className="fc_discount_badge">{product.discount}</span>
              )}

              <button
                type="button"
                className={`fc_heart_btn ${isLiked ? "active" : ""}`}
                onClick={() => toggleLike(product.id)}
              >
                <Heart size={19} fill={isLiked ? "currentColor" : "none"} />
              </button>

              <img src={product.image} alt={product.name} />

              <div className="fc_rating">
                <Star size={14} fill="currentColor" />
                4.8
              </div>

              <h3>{product.name}</h3>
              <p>{product.qty}</p>

              <div className="fc_product_bottom">
                <div>
                  <strong>{product.price}</strong>
                  {product.oldPrice && <del>{product.oldPrice}</del>}
                </div>

                <button type="button" onClick={() => handleAddToCart(product.id)}>
                  <Plus size={19} />
                  {quantity > 0 && <span>{quantity}</span>}
                </button>
              </div>
            </article>
          );
        })
      )}
    </div>
  );

  if (loading) {
    return <p className="fc_loading">Loading dashboard...</p>;
  }

  if (!user) {
    return (
      <main className="fc_dashboard">
        <header className="fc_top_nav">
          <div className="fc_brand_area">
            <button
              className="fc_menu_btn"
              type="button"
              onClick={() => setIsAccountDrawerOpen(true)}
            >
              <Menu size={26} />
            </button>

            <Link href="/" className="fc_logo">
              <img src="/freshcart-logo.png" alt="FreshCart Logo" />
              <span>freshcart</span>
            </Link>
          </div>

          <div className="fc_auth_buttons">
            <Link href="/user/login">Log in</Link>
            <Link href="/user/register" className="fc_signup_link">
              Sign up
            </Link>
          </div>
        </header>

        <section className="fc_not_logged_in">
          <h1>Please login first</h1>
          <p>You need to login to view your FreshCart dashboard.</p>
          <Link href="/user/login">Go to Login</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="fc_dashboard">
      <header className="fc_top_nav">
        <div className="fc_brand_area">
          <button
            className="fc_menu_btn"
            type="button"
            onClick={() => setIsAccountDrawerOpen(true)}
          >
            <Menu size={26} />
          </button>

          <Link href="/user/dashboard" className="fc_logo">
            <img src="/freshcart-logo.png" alt="FreshCart Logo" />
            <span>FreshCart</span>
          </Link>
        </div>

        <div className="fc_search_box">
          <Search size={25} />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products, stores, and groceries"
          />
        </div>

        <button
          type="button"
          className="fc_location_btn"
          onClick={() => setIsAddressModalOpen(true)}
        >
          <MapPin size={25} />
          <span>{selectedAddress.shortLabel}</span>
          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          className="fc_user_cart_btn"
          onClick={() => setIsCartDrawerOpen(true)}
        >
          <ShoppingCart size={25} />
          <strong>{totalCartItems}</strong>
        </button>
      </header>

      <div className="fc_layout">
        <aside className="fc_sidebar">
          <nav className="fc_sidebar_nav">
            <button
              type="button"
              className={activeView === "home" ? "active" : ""}
              onClick={() => {
                setActiveView("home");
                setActiveFilter("All");
              }}
            >
              <Home size={25} />
              Home
            </button>

            <button
              type="button"
              className={activeView === "store" ? "active" : ""}
              onClick={() => {
                setActiveView("store");
                setActiveFilter("All");
              }}
            >
              <Store size={25} />
              Store
            </button>

            <button
              type="button"
              className={activeView === "grocery" ? "active" : ""}
              onClick={() => {
                setActiveView("grocery");
                setActiveFilter("All");
              }}
            >
              <Leaf size={25} />
              Grocery
            </button>

            <button
              type="button"
              className={activeView === "offers" ? "active" : ""}
              onClick={() => {
                setActiveView("offers");
                setActiveFilter("All");
              }}
            >
              <Tag size={25} />
              Offers
            </button>

            <button
              type="button"
              className={activeView === "category" ? "active" : ""}
              onClick={() => {
                setActiveView("category");
                setActiveFilter("All");
              }}
            >
              <Grid3X3 size={25} />
              Category
            </button>
          </nav>

          <div className="fc_sidebar_account">
            <h3>You</h3>

            <button type="button" onClick={() => setIsAccountDrawerOpen(true)}>
              <User size={25} />
              Account
            </button>
          </div>
        </aside>

        <section className="fc_main_content">
          {activeView === "home" && (
            <>
              <section className={`fc_banner_carousel ${banner.variant}`}>
                <button
                  type="button"
                  className="fc_banner_arrow left"
                  onClick={handlePreviousBanner}
                  aria-label="Previous banner"
                >
                  <ChevronLeft size={26} />
                </button>

                <button
                  type="button"
                  className="fc_banner_slide"
                  onClick={() => handleBannerClick(banner.view)}
                >
                  <div className="fc_banner_text">
                    <span>{banner.buttonText}</span>
                    <h1>{banner.title}</h1>
                    <p>{banner.subtitle}</p>
                  </div>

                  <div className="fc_banner_image">
                    <img src={banner.image} alt={banner.title} />
                  </div>
                </button>

                <button
                  type="button"
                  className="fc_banner_arrow right"
                  onClick={handleNextBanner}
                  aria-label="Next banner"
                >
                  <ChevronRight size={26} />
                </button>

                <div className="fc_banner_dots">
                  {banners.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Show banner ${index + 1}`}
                      onClick={() => setActiveBanner(index)}
                      className={activeBanner === index ? "active" : ""}
                    />
                  ))}
                </div>
              </section>

              <section className="fc_store_section">
                <div className="fc_section_title">
                  <h2>Stores near you</h2>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("store");
                      setActiveFilter("All");
                    }}
                  >
                    View all
                  </button>
                </div>

                {renderStoreCards(filteredStores)}
              </section>

              <section className="fc_category_section">
                <div className="fc_section_title">
                  <h2>Shop by category</h2>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("category");
                      setActiveFilter("All");
                    }}
                  >
                    See all
                  </button>
                </div>

                {renderCategoryCards()}
              </section>

              <section className="fc_products_section">
                <div className="fc_section_title">
                  <h2>Popular fresh items</h2>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("grocery");
                      setActiveFilter("All");
                    }}
                  >
                    View all
                  </button>
                </div>

                {renderProductCards(searchedProducts.slice(0, 8))}
              </section>
            </>
          )}

          {activeView === "store" && (
            <section className="fc_page_section">
              <div className="fc_page_header">
                <div>
                  <h1>Available stores near you</h1>
                  <p>Choose a store and start shopping fresh grocery items.</p>
                </div>
              </div>

              {renderStoreCards(filteredStores)}
            </section>
          )}

          {activeView === "grocery" && (
            <section className="fc_page_section">
              <div className="fc_page_header">
                <div>
                  <h1>All grocery items</h1>
                  <p>Browse all available FreshCart grocery products.</p>
                </div>
              </div>

              {renderProductCards(searchedProducts)}
            </section>
          )}

          {activeView === "offers" && (
            <section className="fc_page_section">
              <div className="fc_page_header">
                <div>
                  <h1>FreshCart offers</h1>
                  <p>Discounted products and store offers available today.</p>
                </div>
              </div>

              <div className="fc_section_title">
                <h2>Store offers</h2>
              </div>

              {renderStoreCards(offerStores)}

              <div className="fc_section_title fc_offer_products_title">
                <h2>Discounted products</h2>
              </div>

              {renderProductCards(offerProducts)}
            </section>
          )}

          {activeView === "category" && (
            <section className="fc_page_section">
              <div className="fc_page_header">
                <div>
                  <h1>Select a category</h1>
                  <p>Choose what you want to purchase from FreshCart.</p>
                </div>
              </div>

              {renderCategoryCards()}

              {activeFilter === "All" ? (
                <div className="fc_category_hint">
                  <h3>Select a category to view products</h3>
                  <p>Click Fruits, Vegetables, Dairy, Bakery, or Drinks above.</p>
                </div>
              ) : (
                <>
                  <div className="fc_section_title fc_category_products_title">
                    <h2>{activeFilter} items</h2>
                  </div>

                  {renderProductCards(filteredProducts)}
                </>
              )}
            </section>
          )}
        </section>
      </div>

      {isCartDrawerOpen && (
        <div
          className="fc_cart_overlay"
          onClick={() => setIsCartDrawerOpen(false)}
        >
          <aside
            className="fc_cart_drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="fc_cart_drawer_header">
              <button
                type="button"
                className="fc_cart_close"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                <X size={28} />
              </button>

              <div>
                <h2>Your Cart</h2>
                <p>Shopping in {selectedAddress.shortLabel}</p>
              </div>

              <span className="fc_cart_header_space" />
            </header>

            {cartProducts.length === 0 ? (
              <section className="fc_cart_empty_drawer">
                <div className="fc_cart_empty_icon">
                  <ShoppingCart size={46} />
                </div>

                <h3>Your cart is empty</h3>
                <p>
                  Start adding fruits, vegetables, dairy, bakery and daily
                  grocery essentials.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView("grocery");
                    setActiveFilter("All");
                  }}
                >
                  Start shopping
                </button>
              </section>
            ) : (
              <>
                <section className="fc_cart_items_area">
                  {cartProducts.map(({ product, quantity }) => {
                    const itemTotal = getPriceNumber(product.price) * quantity;

                    return (
                      <article className="fc_cart_item" key={product.id}>
                        <img src={product.image} alt={product.name} />

                        <div className="fc_cart_item_info">
                          <h4>{product.name}</h4>
                          <p>{product.qty}</p>
                          <strong>{product.price}</strong>

                          {quantity > 1 && (
                            <small>{formatNepaliPrice(itemTotal)} total</small>
                          )}
                        </div>

                        <div className="fc_cart_item_actions">
                          <button
                            type="button"
                            className="fc_cart_delete"
                            onClick={() => removeCartItem(product.id)}
                            aria-label="Delete item"
                          >
                            <Trash2 size={20} />
                          </button>

                          <button
                            type="button"
                            onClick={() => decreaseCartItem(product.id)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={18} />
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            onClick={() => increaseCartItem(product.id)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </section>

                <section className="fc_cart_summary_box">
                  <div className="fc_cart_summary_row">
                    <span>Item subtotal</span>
                    <strong>{formatNepaliPrice(itemSubtotal)}</strong>
                  </div>

                  <div className="fc_cart_summary_row">
                    <span>Delivery charge</span>
                    <strong>{formatNepaliPrice(deliveryFee)}</strong>
                  </div>

                  <div className="fc_cart_total_row">
                    <span>Total</span>
                    <strong>{formatNepaliPrice(totalAmount)}</strong>
                  </div>

                  <button
                    type="button"
                    className="fc_cart_clear_btn"
                    onClick={clearCart}
                  >
                    Clear cart
                  </button>
                </section>

        <footer className="fc_cart_drawer_footer">
         <button type="button" className="fc_cart_checkout_btn">
         Go to checkout
         </button>
       </footer>
              </>
            )}
          </aside>
        </div>
      )}

      {isAddressModalOpen && (
        <div
          className="fc_address_overlay"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <section
            className="fc_address_modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="fc_address_close"
              onClick={() => setIsAddressModalOpen(false)}
              aria-label="Close address modal"
            >
              <X size={26} />
            </button>

            <h2>Choose address</h2>

            <div className="fc_address_search_box">
              <input
                value={addressSearch}
                onChange={(event) => setAddressSearch(event.target.value)}
                placeholder="Enter your address"
                autoFocus
              />
              <Search size={24} />
            </div>

            <div className="fc_address_list">
              {(addressSearch ? searchedAddresses : savedAddresses).map(
                (address) => (
                  <button
                    type="button"
                    key={address.id}
                    className="fc_address_item"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <span
                      className={
                        selectedAddress.id === address.id
                          ? "fc_address_radio selected"
                          : "fc_address_radio"
                      }
                    />

                    <span className="fc_address_text">
                      <strong>{address.label}</strong>
                      <small>{address.detail}</small>
                    </span>

                    <span
                      className="fc_address_edit"
                      onClick={(event) => {
                        event.stopPropagation();
                        setAddressSearch(address.label);
                      }}
                    >
                      Edit
                    </span>
                  </button>
                )
              )}

              {addressSearch && searchedAddresses.length === 0 && (
                <div className="fc_address_empty">
                  <h3>No address found</h3>
                  <p>Try Basundhara, New Road, or Baneshwor.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {isAccountDrawerOpen && (
        <div
          className="fc_drawer_overlay"
          onClick={() => setIsAccountDrawerOpen(false)}
        >
          <aside
            className="fc_account_drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="fc_drawer_header">
              <div>
                <h2>{displayName}</h2>
                <p>Customer since April 2026</p>
              </div>

              <button
                type="button"
                className="fc_drawer_close"
                onClick={() => setIsAccountDrawerOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="fc_drawer_promo">
              <h3>FreshCart+ perk alert!</h3>
              <p>Fresh grocery deals, faster delivery, and special discounts.</p>
            </div>

            <div className="fc_drawer_trial">
              <h3>Start your FreshCart+ trial today!</h3>
              <p>You can cancel anytime.</p>
              <button type="button">Try FreshCart+ for free</button>
              <strong>freshcart+</strong>
            </div>

            <div className="fc_drawer_section">
              <p className="fc_drawer_section_title">Manage your account</p>

              <button
                type="button"
                className="fc_drawer_active"
                onClick={() => {
                  setActiveView("store");
                  setActiveFilter("All");
                  setIsAccountDrawerOpen(false);
                }}
              >
                <Store size={22} />
                Stores
              </button>

              <button type="button">
                <Package size={22} />
                Your orders
              </button>

              <button type="button">
                <HeartHandshake size={22} />
                Wishlist
              </button>

              <Link href="/user/profile">
                <Settings size={22} />
                Account settings
              </Link>
            </div>

            <div className="fc_drawer_section">
              <p className="fc_drawer_section_title">Support</p>

              <button type="button">
                <HelpCircle size={22} />
                Help Center
              </button>

              <button type="button">
                <Leaf size={22} />
                How FreshCart works
              </button>
            </div>

            <div className="fc_drawer_section">
              <p className="fc_drawer_section_title">Our apps</p>

              <button type="button">
                <Apple size={22} />
                App Store
              </button>

              <button type="button">
                <Play size={22} />
                Google Play
              </button>
            </div>

            <div className="fc_drawer_logout_area">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsAccountDrawerOpen(false);
                }}
              >
                <LogOut size={22} />
                Log out
              </button>
            </div>

            <div className="fc_drawer_footer">
              <span>Press</span>
              <span>Jobs</span>
              <span>Terms</span>
              <span>Privacy</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}