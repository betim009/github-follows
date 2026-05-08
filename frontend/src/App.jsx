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
  Skeleton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
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
  const [view, setView] = useState("notFollowingBack");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  async function handleSearch() {
    setLoading(true);

    try {
      const data = await getGithubFollowData();
      setResult(data);
      setLastUpdatedAt(new Date());
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao buscar dados do GitHub. Verifique o token/usuário no .env.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const notFollowingBack = result?.notFollowingBack ?? [];
  const notFollowedBack = result?.notFollowedBack ?? [];
  const selectedList = view === "notFollowedBack" ? notFollowedBack : notFollowingBack;
  const emptyText =
    view === "notFollowedBack"
      ? "Você segue de volta todo mundo que te segue."
      : "Todo mundo que você segue também te segue.";

  const summary = useMemo(() => {
    if (!result) return null;
    return {
      followers: result.followers.length,
      following: result.following.length,
      notFollowingBack: result.notFollowingBack.length,
      notFollowedBack: result.notFollowedBack.length,
    };
  }, [result]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) return null;
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(lastUpdatedAt);
  }, [lastUpdatedAt]);

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
            {loading ? "Buscando..." : result ? "Atualizar" : "Buscar"}
          </Button>
        </Toolbar>
        <Divider />
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={1.25}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "baseline" }}
                justifyContent="space-between"
              >
                <Typography variant="h5">Mini Dashboard</Typography>
                <Typography variant="caption" color="text.secondary">
                  {lastUpdatedLabel ? `Última atualização: ${lastUpdatedLabel}` : "Ainda não buscado"}
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
                  gap: 1,
                  pt: 0.5,
                }}
              >
                {loading ? (
                  <>
                    <Skeleton variant="rounded" height={72} />
                    <Skeleton variant="rounded" height={72} />
                    <Skeleton variant="rounded" height={72} />
                    <Skeleton variant="rounded" height={72} />
                  </>
                ) : (
                  <>
                    <Paper variant="outlined" sx={{ p: 1.25 }}>
                      <Typography variant="overline" color="text.secondary">
                        Seguidores
                      </Typography>
                      <Typography variant="h5">{summary?.followers ?? "—"}</Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 1.25 }}>
                      <Typography variant="overline" color="text.secondary">
                        Seguindo
                      </Typography>
                      <Typography variant="h5">{summary?.following ?? "—"}</Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 1.25 }}>
                      <Typography variant="overline" color="text.secondary">
                        Não me seguem
                      </Typography>
                      <Typography variant="h5">{summary?.notFollowingBack ?? "—"}</Typography>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 1.25 }}>
                      <Typography variant="overline" color="text.secondary">
                        Eu não sigo
                      </Typography>
                      <Typography variant="h5">{summary?.notFollowedBack ?? "—"}</Typography>
                    </Paper>
                  </>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Use as abas abaixo para alternar entre as listas: quem você segue e não te segue de volta,
                e quem te segue e você não segue de volta.
              </Typography>

              {summary && (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ pt: 0.5 }}>
                  <Chip label={`Seguidores: ${summary.followers}`} variant="outlined" />
                  <Chip label={`Seguindo: ${summary.following}`} variant="outlined" />
                  <Chip
                    color={summary.notFollowingBack > 0 ? "warning" : "success"}
                    label={`Não seguem de volta: ${summary.notFollowingBack}`}
                  />
                  <Chip
                    color={summary.notFollowedBack > 0 ? "info" : "success"}
                    label={`Eu não sigo de volta: ${summary.notFollowedBack}`}
                    variant={summary.notFollowedBack > 0 ? "filled" : "outlined"}
                  />
                </Stack>
              )}

              {!loading && result && summary && summary.notFollowingBack === 0 && summary.notFollowedBack === 0 && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Tudo certo — não há diferenças entre seguidores e seguindo.
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
              <>
                <Tabs
                  value={view}
                  onChange={(_, next) => setView(next)}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab
                    value="notFollowingBack"
                    label={`Não me seguem (${summary?.notFollowingBack ?? 0})`}
                  />
                  <Tab
                    value="notFollowedBack"
                    label={`Eu não sigo (${summary?.notFollowedBack ?? 0})`}
                  />
                </Tabs>
                <Divider />

                {selectedList.length === 0 ? (
                  <Box sx={{ p: 3 }}>
                    <Alert severity="success">{emptyText}</Alert>
                  </Box>
                ) : (
                  <List disablePadding>
                    {selectedList.map((user, idx) => (
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
                        {idx !== selectedList.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                )}
              </>
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
