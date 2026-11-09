import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  ThemeProvider,
  createTheme,
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Paper,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const theme = createTheme({
  palette: {
    primary: { main: "rgb(255, 112, 67)", contrastText: "#ffffff" },
    secondary: { main: "#556B2F" },
    background: { default: "#FDFBF7" },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJZfFkg7OvO4onyqGWYNbCqD4jpDPUTC7gl3URa87wLd6F8sP2eOpV1gA7hx93dpizcnekKTIZd3w5/pub?output=csv";

export default function DigitalMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedTab, setSelectedTab] = useState(0);

  // App states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse(GOOGLE_SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const rawData = results.data;

        const validItems = rawData
          ?.filter((item) => item.name && item.name.trim() !== "")
          ?.filter((item) => item.available?.toUpperCase() === "TRUE")
          ?.map((item, index) => ({
            id: item.id || index,
            name: item.name.trim(),
            category: item.category ? item.category.trim() : "Uncategorized",
            price: item.price ? item.price.trim() : "",
            description: item.description ? item.description.trim() : "",
            image: item.image
              ? item.image.trim()
              : "https://via.placeholder.com/400x300?text=No+Photo",
            isChefSpecial: item.is_special?.toUpperCase() === "TRUE",
          }));

        const uniqueCategories = [
          "All",
          ...new Set(validItems.map((i) => i.category)),
        ];

        setCategories(uniqueCategories);
        setMenuItems(validItems);
        setLoading(false);
      },
      error: (error) => {
        console.error(error);
        setError(
          "Could not connect to the live menu. Please check your internet connection.",
        );
        setLoading(false);
      },
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const currentCat = categories[selectedTab] || "All";

  const menuSections =
    currentCat === "All"
      ? categories
          .filter((cat) => cat !== "All")
          .map((cat) => ({
            title: cat,
            items: menuItems.filter((item) => item.category === cat),
          }))
          .filter((section) => section.items.length > 0)
      : [
          {
            title: currentCat,
            items: menuItems.filter((item) => item.category === currentCat),
          },
        ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
        {/* Sticky Header */}
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: "white" }}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <RestaurantMenuIcon
              sx={{ color: "primary.main", mr: 1.5, fontSize: 32 }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{ color: "#222", fontWeight: 800 }}
            >
              OLIVE{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                CAFÉ
              </Box>
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            bgcolor: "primary.dark",
            color: "white",
            py: 3,
            px: 2,
            textAlign: "center",
            borderBottom: "4px solid",
            borderColor: "secondary.main",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome to Olive Café Bahir Dar
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.9, letterSpacing: "0.5px" }}
          >
            Savoring traditional Ethiopian hospitality and fresh Bahir Dar
            flavors
          </Typography>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 3 }}>
          {/* LOADING STATE */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 10,
              }}
            >
              <CircularProgress color="primary" size={50} />
              <Typography sx={{ mt: 2, color: "text.secondary" }}>
                Loading today's fresh menu...
              </Typography>
            </Box>
          )}

          {/* ERROR STATE */}
          {error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              {error}
            </Alert>
          )}

          {/* SUCCESS STATE */}
          {!loading && !error && (
            <>
              {/* Dynamic Categories Tabs */}
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  borderBottom: "1px solid #eee",
                  bgcolor: "transparent",
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  indicatorColor="primary"
                  textColor="primary"
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                    },
                  }}
                >
                  {categories.map((cat, index) => (
                    <Tab key={index} label={cat} />
                  ))}
                </Tabs>
              </Paper>

              {menuSections.length === 0 ? (
                <Typography
                  textAlign="center"
                  color="text.secondary"
                  sx={{ mt: 6 }}
                >
                  No items available right now.
                </Typography>
              ) : (
                menuSections.map((section, sIndex) => (
                  <Box key={sIndex} sx={{ mb: 6, width: "100%" }}>
                    {/* Category Header */}
                    {selectedTab === 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 3,
                          mt: sIndex > 0 ? 4 : 0,
                        }}
                      >
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            fontWeight: 800,
                            color: "secondary.main",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            pr: 2,
                          }}
                        >
                          {section.title}
                        </Typography>
                        <Divider
                          sx={{
                            flexGrow: 1,
                            borderColor: "rgba(85, 107, 47, 0.2)",
                            borderBottomWidth: 2,
                          }}
                        />
                      </Box>
                    )}

                    {/* Fixed Balanced Columns Container */}
                    <Box
                      sx={{
                        columnCount: { xs: 1, sm: 2, md: 3 },
                        columnGap: 3,
                        columnFill: "balance", // Forces columns to distribute item heights evenly
                        width: "100%",
                        mx: "auto",
                      }}
                    >
                      {section.items.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            breakInside: "avoid-column", // Prevents a card from splitting in half over a column break
                            mb: 3,
                            display: "block", // Replaced inline-block to eliminate horizontal offset gaps
                            width: "100%",
                            boxSizing: "border-box",
                          }}
                        >
                          <Card
                            sx={{
                              borderRadius: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                              border: "1px solid rgba(0,0,0,0.03)",
                              width: "100%",
                            }}
                          >
                            <Box sx={{ position: "relative" }}>
                              <CardMedia
                                component="img"
                                image={item.image}
                                // image={`${item.image}?t=${new Date().getTime()}`}
                                alt={item.name}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  display: "block",
                                  maxHeight: "350px", // Safeguard against massive portrait photos breaking the rhythm
                                  objectFit: "cover",
                                }}
                              />
                              {item.isChefSpecial && (
                                <Chip
                                  icon={
                                    <LocalOfferIcon
                                      style={{ color: "white" }}
                                    />
                                  }
                                  label="Chef's Special"
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 12,
                                    left: 12,
                                    bgcolor: "secondary.main",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                            </Box>

                            <CardContent sx={{ p: 2.5 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  mb: 1.5,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#2D3748",
                                    lineHeight: 1.2,
                                    pr: 1,
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Chip
                                  label={item.price}
                                  color="primary"
                                  sx={{ fontWeight: "bold", borderRadius: 1.5 }}
                                />
                              </Box>

                              {item.description && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ lineHeight: 1.6 }}
                                >
                                  {item.description}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))
              )}
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
