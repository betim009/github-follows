const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const USERNAME = import.meta.env.VITE_GITHUB_USERNAME;

async function getAllPages(url) {
  let page = 1;
  let results = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${url}?per_page=100&page=${page}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do GitHub");
    }

    const data = await response.json();

    results = [...results, ...data];

    hasMore = data.length === 100;
    page++;
  }

  return results;
}

export async function getGithubFollowData() {
  const followers = await getAllPages(
    `https://api.github.com/users/${USERNAME}/followers`
  );

  const following = await getAllPages(
    `https://api.github.com/users/${USERNAME}/following`
  );

  const followersLogins = followers.map((user) => user.login);

  const notFollowingBack = following.filter(
    (user) => !followersLogins.includes(user.login)
  );

  return {
    followers,
    following,
    notFollowingBack,
  };
}
