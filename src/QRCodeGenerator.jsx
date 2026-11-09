import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const DEFAULT_SCAN_ME_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='black'/><text x='50%' y='55%' font-family='Arial, sans-serif' font-size='14' font-weight='bold' fill='white' text-anchor='middle'>SCAN ME</text></svg>";

export default function QRCodeGenerator() {
  const theme = useTheme();
  const fileInputRef = useRef(null);

  const [url, setUrl] = useState("https://google.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [includeLogo, setIncludeLogo] = useState(false);
  const [logoType, setLogoType] = useState("image");
  const [customLogo, setCustomLogo] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");

  const [qrConfig, setQrConfig] = useState({
    url: "https://google.com",
    fgColor: "#000000",
    includeLogo: false,
    logoSrc: null,
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => setCustomLogo(reader.result);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleGenerate = () => {
    let logoSrc = null;
    if (includeLogo) {
      logoSrc = logoType === "svg" ? DEFAULT_SCAN_ME_SVG : customLogo;
    }

    setQrConfig({
      url: url || "https://google.com",
      fgColor,
      includeLogo,
      logoSrc,
    });
  };

  // Direct viewport printing trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "background.default",
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Clean base container overrides for printing
        "@media print": {
          p: 0,
          bgcolor: "transparent",
        },
      }}
    >
      {/* Dynamic page styling to override standard browser headers/footers */}
      <style>
        {`
          @media print {
            @page {
              size: auto;
              margin: 15mm;
            }
            body {
              background: white !important;
            }
          }
        `}
      </style>

      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 1024,
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          "@media print": {
            boxShadow: "none",
            borderRadius: 0,
          },
        }}
      >
        {/* Left Side: Configurator Panel (Hidden entirely during print) */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: 4,
            borderRight: { md: `1px solid ${theme.palette.divider}` },
            borderBottom: {
              xs: `1px solid ${theme.palette.divider}`,
              md: "none",
            },
            bgcolor: "background.paper",
            "@media print": {
              display: "none",
            },
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              QR Code Configurator
            </Typography>
            <Divider />

            <TextField
              label="Target URL"
              variant="outlined"
              type="url"
              fullWidth
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                QR Code Color
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "2px",
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {fgColor}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                    color="primary"
                  />
                }
                label="Include Center Logo / Badge"
              />

              {includeLogo && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mt: 1, bgcolor: "action.hover" }}
                >
                  <RadioGroup
                    row
                    value={logoType}
                    onChange={(e) => setLogoType(e.target.value)}
                  >
                    <FormControlLabel
                      value="image"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">Custom Image</Typography>
                      }
                    />
                    <FormControlLabel
                      value="svg"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2">Default SVG</Typography>
                      }
                    />
                  </RadioGroup>

                  {logoType === "image" && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        disableElevation
                      >
                        Upload Image
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleLogoChange}
                        />
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        {selectedFileName || "No file selected"}
                      </Typography>
                    </Stack>
                  )}
                </Paper>
              )}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Print Customizer (Optional)
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Header Text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="e.g., Welcome to our Store"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                />
                <TextField
                  label="Footer Text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="e.g., Thank you for visiting!"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleGenerate}
              sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
            >
              Generate QR Code
            </Button>
          </Stack>
        </Box>

        {/* Right Side: Preview Panel */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: 4,
            bgcolor: "action.hover",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            "@media print": {
              width: "100%",
              p: 0,
              bgcolor: "transparent",
            },
          }}
        >
          <Typography
            variant="overline"
            color="text.disabled"
            fontWeight="bold"
            sx={{
              "@media print": {
                display: "none",
              },
            }}
          >
            Live Preview
          </Typography>

          {/* Actual Element to be printed */}
          <Paper
            className="print-area"
            elevation={2}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 380,
              minHeight: 380,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxSizing: "border-box",
              textAlign: "center",
              "@media print": {
                boxShadow: "none",
                borderRadius: 0,
                maxWidth: "100%",
                p: 2,
              },
            }}
          >
            {headerText && (
              <Typography
                variant="h6"
                component="h6"
                fontWeight="bold"
                align="center"
                sx={{ width: "100%", wordBreak: "break-word" }}
              >
                {headerText}
              </Typography>
            )}

            <Box
              className="print-qr-wrap"
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <QRCodeCanvas
                value={qrConfig.url}
                size={800}
                bgColor="#ffffff"
                fgColor={qrConfig.fgColor}
                level="H"
                includeMargin
                style={{
                  width: "90%",
                  height: "auto",
                }}
                imageSettings={
                  qrConfig.includeLogo && qrConfig.logoSrc
                    ? {
                        src: qrConfig.logoSrc,
                        x: undefined,
                        y: undefined,
                        height: 270,
                        width: 270,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </Box>

            {footerText && (
              <Typography
                variant="body2"
                component="p"
                color="text.secondary"
                align="center"
                fontWeight="medium"
                sx={{ width: "100%", wordBreak: "break-word" }}
              >
                {footerText}
              </Typography>
            )}
          </Paper>

          {/* Print Trigger Button (Hidden entirely during print) */}
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              width: "100%",
              maxWidth: 340,
              fontWeight: "bold",
              "@media print": {
                display: "none",
              },
            }}
          >
            Print / Save PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
