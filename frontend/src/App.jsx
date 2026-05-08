import { useMemo, useState } from "react";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupsIcon from "@mui/icons-material/Groups";
import { getGithubFollowData } from "./services/githubApi";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  async function handleSearch() {
    setLoading(true);

    try {
      const data = await getGithubFollowData();
      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao buscar dados do GitHub. Verifique o token/usuário no .env.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const notFollowingBack = result?.notFollowingBack ?? [];
  const summary = useMemo(() => {
    if (!result) return null;
    return {
      followers: result.followers.length,
      following: result.following.length,
      notFollowingBack: result.notFollowingBack.length,
    };
  }, [result]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <GroupsIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                GitHub Follow Checker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compare quem você segue vs. quem te segue
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={18} /> : <PersonSearchIcon />
            }
          >
            {loading ? "Buscando..." : "Ver quem não me segue"}
          </Button>
        </Toolbar>
        <Divider />
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={1.25}>
              <Typography variant="h5">Resultado</Typography>
              <Typography variant="body2" color="text.secondary">
                Clique em “Ver quem não me segue” para buscar seguidores/seguindo e listar quem não segue
                de volta.
              </Typography>

              {summary && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ pt: 0.5 }}>
                  <Chip label={`Seguidores: ${summary.followers}`} variant="outlined" />
                  <Chip label={`Seguindo: ${summary.following}`} variant="outlined" />
                  <Chip
                    color={summary.notFollowingBack > 0 ? "warning" : "success"}
                    label={`Não seguem de volta: ${summary.notFollowingBack}`}
                  />
                </Stack>
              )}

              {!loading && result && notFollowingBack.length === 0 && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Boa! Ninguém ficou pendente — todo mundo que você segue também te segue.
                </Alert>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            {loading && (
              <Box sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Carregando…
                  </Typography>
                </Stack>
              </Box>
            )}

            {!loading && result && (
              <List disablePadding>
                {notFollowingBack.map((user, idx) => (
                  <Box key={user.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component="a"
                        href={user.html_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ListItemAvatar>
                          <Avatar alt={user.login} src={user.avatar_url} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.login}
                          secondary={user.html_url}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItemButton>
                    </ListItem>
                    {idx !== notFollowingBack.length - 1 && <Divider component="li" />}
                  </Box>
                ))}
              </List>
            )}

            {!loading && !result && (
              <Box sx={{ p: 3 }}>
                <Alert severity="info">
                  Pronto para começar. Configure `VITE_GITHUB_USERNAME` e `VITE_GITHUB_TOKEN` no
                  `frontend/.env`.
                </Alert>
              </Box>
            )}
          </Paper>
        </Stack>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
