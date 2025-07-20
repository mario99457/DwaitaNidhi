import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import CachedData, { ApiEndpoints } from "../../Services/Common/GlobalServices";
import localforage from "localforage";
import RefreshIcon from "@mui/icons-material/Refresh";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";

const SettingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [throttlingEnabled, setThrottlingEnabled] = useState(ApiEndpoints.ENABLE_THROTTLING);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Use the centralized method to clear all cached data
      await CachedData.clearAllCache();
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error("Error clearing cache:", error);
    } finally {
      setIsClearing(false);
      setShowConfirmDialog(false);
    }
  };

  const handleThrottlingToggle = (enabled: boolean) => {
    if (enabled) {
      ApiEndpoints.enableThrottling();
    } else {
      ApiEndpoints.disableThrottling();
    }
    setThrottlingEnabled(enabled);
  };

  const getCacheInfo = () => {
    const cachedKeys = Object.keys(CachedData.data);
    const totalBooks = CachedData.data.books?.length || 0;
    const loadedBooks = cachedKeys.filter(key => 
      key !== 'books' && 
      (key.endsWith('index') || key.endsWith('summary') || key.endsWith('audio'))
    ).length;
    
    return {
      totalBooks,
      loadedBooks,
      cachedKeys: cachedKeys.length
    };
  };

  const cacheInfo = getCacheInfo();

  return (
    <Container>
      <Box
        sx={{
          width: {
            lg: "90%",
            xs: "100%",
          },
          background: "#FFFFFF",
          margin: "auto",
          minHeight: "100%",
          padding: { lg: "16px 38px", xs: "16px" },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { lg: "48px", xs: "32px" },
            fontWeight: "400",
            color: "#BC4501",
            mb: 4,
          }}
        >
          Settings
        </Typography>

        {showSuccessAlert && (
          <Alert 
            severity="success" 
            sx={{ mb: 3 }}
            onClose={() => setShowSuccessAlert(false)}
          >
            Cache cleared successfully! The app will reload fresh data on next access.
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Cache Information */}
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <StorageIcon color="primary" />
              <Typography variant="h6" color="primary">
                Cache Information
              </Typography>
            </Stack>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Total Books Available: {cacheInfo.totalBooks}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Books Currently Loaded: {cacheInfo.loadedBooks}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Total Cached Items: {cacheInfo.cachedKeys}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Performance Settings */}
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <SpeedIcon color="info" />
              <Typography variant="h6" color="info.main">
                Performance Settings
              </Typography>
            </Stack>
            
            <FormControlLabel
              control={
                <Switch
                  checked={throttlingEnabled}
                  onChange={(e) => handleThrottlingToggle(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable Request Throttling (Protection against data scraping)"
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              When enabled, this prevents rapid requests that could be used to extract data. 
              Disable only for development/testing.
            </Typography>
          </Box>

          {/* Clear Cache Section */}
          <Box
            sx={{
              p: 3,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <RefreshIcon color="warning" />
              <Typography variant="h6" color="warning.main">
                Clear Cache
              </Typography>
            </Stack>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This will clear all cached book data and force a fresh download from the server. 
              This is useful if you're experiencing issues or want to ensure you have the latest data.
            </Typography>

            <Button
              variant="outlined"
              color="warning"
              onClick={() => setShowConfirmDialog(true)}
              disabled={isClearing}
              startIcon={<RefreshIcon />}
            >
              {isClearing ? "Clearing..." : "Clear All Cached Data"}
            </Button>
          </Box>
        </Stack>

        {/* Confirmation Dialog */}
        <Dialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Clear All Cached Data?
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary">
              This action will:
            </Typography>
            <ul>
              <li>Remove all downloaded book data</li>
              <li>Clear local storage cache</li>
              <li>Force fresh downloads on next access</li>
            </ul>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This cannot be undone. Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleClearCache}
              color="warning"
              variant="contained"
              disabled={isClearing}
            >
              {isClearing ? "Clearing..." : "Clear Cache"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SettingsPage; 