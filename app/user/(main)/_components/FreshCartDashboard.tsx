"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  MapPin,
  Bell,
  CreditCard,
  Heart,
  Plus,
  Minus,
  Trash2,
  Star,
  Home,
  Grid3X3,
  ChevronRight,
  ChevronLeft,
  Tag,
  Leaf,
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
import {
  getProductImageUrl,
  getProducts,
  Product as ApiProduct,
} from "@/lib/api/products";
import {
  getCategories,
  getCategoryImageUrl,
  Category as ApiCategory,
} from "@/lib/api/categories";

import "../dashboard/dashboard.css";

type ViewType = "home" | "grocery" | "offers" | "category";

type CategoryItem = {
  id: string;
  name: string;
  image: string;
};

type ProductItem = {
  id: string;
  name: string;
  image: string;
  qty: string;
  price: string;
  priceNumber: number;
  oldPrice?: string;
  discount?: string;
  category: string;
  stock: number;
  unit: string;
  description: string;
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
    title: "Shop all fresh items",
    subtitle: "Everything you need for your kitchen, delivered fresh and fast.",
    buttonText: "Shop all",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop",
    variant: "allshop",
    view: "grocery",
  },
];

const defaultCategories: CategoryItem[] = [
  {
    id: "fruits",
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop",
  },
  {
    id: "vegetables",
    name: "Vegetables",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
  },
  {
    id: "dairy",
    name: "Dairy",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop",
  },
  {
    id: "bakery",
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
  },
  {
    id: "drinks",
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&auto=format&fit=crop",
  },
];

const categoryFallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop";

const productFallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop";

const formatNepaliPrice = (amount: number) => {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
};

const mapApiProductToProductItem = (product: ApiProduct): ProductItem => {
  const unit = product.unit || "piece";

  return {
    id: product.id,
    name: product.name,
    image: getProductImageUrl(product.image) || productFallbackImage,
    qty: `1 ${unit}`,
    price: formatNepaliPrice(product.price),
    priceNumber: Number(product.price || 0),
    category: product.category || "Other",
    stock: Number(product.stock || 0),
    unit,
    description: product.description || "",
  };
};

const mapApiCategoryToCategoryItem = (category: ApiCategory): CategoryItem => {
  return {
    id: category.id,
    name: category.name,
    image: getCategoryImageUrl(category.image) || categoryFallbackImage,
  };
};

export default function FreshCartDashboard({
  view,
}: {
  view: ViewType;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading, logout } = useAuth();

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

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const [adminCategories, setAdminCategories] = useState<CategoryItem[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

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

  const goToView = (nextView: ViewType) => {
    if (nextView === "home") {
      router.push("/user/dashboard");
      return;
    }

    if (nextView === "grocery") {
      router.push("/user/grocery");
      return;
    }

    if (nextView === "offers") {
      router.push("/user/offers");
      return;
    }

    if (nextView === "category") {
      router.push("/user/category");
    }
  };

  const loadProducts = async () => {
    try {
      setIsProductsLoading(true);
      setProductsError("");

      const response = await getProducts({
        page: 1,
        limit: 100,
      });

      setProducts(response.data.map(mapApiProductToProductItem));
    } catch (err: any) {
      setProductsError(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      setCategoriesError("");

      const response = await getCategories();

      setAdminCategories(response.data.map(mapApiCategoryToCategoryItem));
    } catch (err: any) {
      setCategoriesError(err.message || "Failed to load categories");
      setAdminCategories([]);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    if (view === "category") {
      const categoryFromUrl = searchParams.get("name");

      if (categoryFromUrl) {
        setActiveFilter(categoryFromUrl);
      } else {
        setActiveFilter("All");
      }
    } else {
      setActiveFilter("All");
    }
  }, [view, searchParams]);

  const categories = useMemo(() => {
    if (adminCategories.length > 0) {
      return adminCategories;
    }

    const existingCategoryNames = new Set(
      defaultCategories.map((category) => category.name.toLowerCase())
    );

    const productCategories = products
      .map((product) => product.category)
      .filter(Boolean)
      .filter((category, index, array) => array.indexOf(category) === index)
      .filter((category) => !existingCategoryNames.has(category.toLowerCase()))
      .map((category) => ({
        id: category.toLowerCase().replace(/\s+/g, "-"),
        name: category,
        image: categoryFallbackImage,
      }));

    return [...defaultCategories, ...productCategories];
  }, [adminCategories, products]);

  const cartProducts = useMemo(() => {
    return products
      .map((product) => ({
        product,
        quantity: cartItems[product.id] || 0,
      }))
      .filter((item) => item.quantity > 0);
  }, [cartItems, products]);

  const totalCartItems = cartProducts.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const itemSubtotal = cartProducts.reduce((total, item) => {
    return total + item.product.priceNumber * item.quantity;
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
        product.category.toLowerCase().includes(text) ||
        product.description.toLowerCase().includes(text)
      );
    });
  }, [searchText, products]);

  const filteredProducts = useMemo(() => {
    return searchedProducts.filter((product) => {
      return activeFilter === "All" || product.category === activeFilter;
    });
  }, [searchedProducts, activeFilter]);

  const searchedAddresses = savedAddresses.filter((address) => {
    const text = addressSearch.toLowerCase();

    return (
      address.label.toLowerCase().includes(text) ||
      address.detail.toLowerCase().includes(text)
    );
  });

  const offerProducts = searchedProducts.filter((product) => product.discount);

  const handlePreviousBanner = () => {
    setActiveBanner((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNextBanner = () => {
    setActiveBanner((prev) => (prev + 1) % banners.length);
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    if (!product || product.stock <= 0) return;

    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const increaseCartItem = (productId: string) => {
    handleAddToCart(productId);
  };

  const decreaseCartItem = (productId: string) => {
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

  const removeCartItem = (productId: string) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[productId];
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems({});
  };

  const handleGoToCheckout = () => {
    if (cartProducts.length === 0) return;

    const checkoutItems = cartProducts.map(({ product, quantity }) => ({
      product: product.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      unit: product.unit,
      category: product.category,
      priceNumber: product.priceNumber,
      quantity,
    }));

    localStorage.setItem(
      "freshcart_checkout_items",
      JSON.stringify(checkoutItems)
    );

    setIsCartDrawerOpen(false);
    router.push("/user/checkout");
  };

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveFilter(categoryName);
    router.push(`/user/category?name=${encodeURIComponent(categoryName)}`);
  };

  const handleBannerClick = (nextView: ViewType) => {
    goToView(nextView);
  };

  const handleAddressSelect = (address: AddressItem) => {
    setSelectedAddress(address);
    setAddressSearch("");
    setIsAddressModalOpen(false);
  };

  const banner = banners[activeBanner % banners.length];

  const renderCategoryCards = () => {
    if (isCategoriesLoading && adminCategories.length === 0) {
      return (
        <div className="fc_empty_state">
          <h3>Loading categories...</h3>
          <p>Please wait while we load FreshCart categories.</p>
        </div>
      );
    }

    if (categoriesError && adminCategories.length === 0) {
      return (
        <div className="fc_empty_state">
          <h3>Unable to load categories</h3>
          <p>{categoriesError}</p>
          <button type="button" onClick={loadCategories}>
            Try again
          </button>
        </div>
      );
    }

    return (
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
  };

  const renderProductCards = (items: ProductItem[]) => {
    if (isProductsLoading) {
      return (
        <div className="fc_empty_state">
          <h3>Loading products...</h3>
          <p>Please wait while we load fresh products.</p>
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="fc_empty_state">
          <h3>Unable to load products</h3>
          <p>{productsError}</p>
          <button type="button" onClick={loadProducts}>
            Try again
          </button>
        </div>
      );
    }

    return (
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
            const isOutOfStock = product.stock <= 0;

            return (
              <article className="fc_product_card" key={product.id}>
                {product.discount && (
                  <span className="fc_discount_badge">{product.discount}</span>
                )}

                {isOutOfStock && (
                  <span className="fc_discount_badge">Out of stock</span>
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

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product.id)}
                  >
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
  };

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
            placeholder="Search products and groceries"
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
            <Link
              href="/user/dashboard"
              className={pathname === "/user/dashboard" ? "active" : ""}
            >
              <Home size={25} />
              Home
            </Link>

            <Link
              href="/user/grocery"
              className={pathname === "/user/grocery" ? "active" : ""}
            >
              <Leaf size={25} />
              Grocery
            </Link>

            <Link
              href="/user/offers"
              className={pathname === "/user/offers" ? "active" : ""}
            >
              <Tag size={25} />
              Offers
            </Link>

            <Link
              href="/user/category"
              className={pathname === "/user/category" ? "active" : ""}
            >
              <Grid3X3 size={25} />
              Category
            </Link>
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
          {view === "home" && (
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

              <section className="fc_category_section">
                <div className="fc_section_title">
                  <h2>Shop by category</h2>

                  <button
                    type="button"
                    onClick={() => router.push("/user/category")}
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
                    onClick={() => router.push("/user/grocery")}
                  >
                    View all
                  </button>
                </div>

                {renderProductCards(searchedProducts.slice(0, 8))}
              </section>
            </>
          )}

          {view === "grocery" && (
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

          {view === "offers" && (
            <section className="fc_page_section">
              <div className="fc_page_header">
                <div>
                  <h1>FreshCart offers</h1>
                  <p>Discounted products available today.</p>
                </div>
              </div>

              <div className="fc_section_title fc_offer_products_title">
                <h2>Discounted products</h2>
              </div>

              {renderProductCards(offerProducts)}
            </section>
          )}

          {view === "category" && (
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
                  <p>Click a category above to view products.</p>
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
                    router.push("/user/grocery");
                  }}
                >
                  Start shopping
                </button>
              </section>
            ) : (
              <>
                <section className="fc_cart_items_area">
                  {cartProducts.map(({ product, quantity }) => {
                    const itemTotal = product.priceNumber * quantity;

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
                  <button
                    type="button"
                    className="fc_cart_checkout_btn"
                    onClick={handleGoToCheckout}
                  >
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

              <Link
                href="/user/grocery"
                onClick={() => setIsAccountDrawerOpen(false)}
              >
                <Leaf size={22} />
                Grocery
              </Link>

              <Link href="/user/account/orders">
                <Package size={22} />
                Your orders
              </Link>

              <Link href="/user/account/wishlist">
                <HeartHandshake size={22} />
                Wishlist
              </Link>

              <Link href="/user/account/addresses">
                <MapPin size={22} />
                Addresses
              </Link>

              <Link href="/user/account/payment">
                <CreditCard size={22} />
                Payment methods
              </Link>

              <Link href="/user/account/notifications">
                <Bell size={22} />
                Notification settings
              </Link>

              <Link href="/user/account">
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