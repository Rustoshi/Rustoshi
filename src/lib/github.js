// GitHub API utilities

/**
 * Fetches pinned repositories for a GitHub user
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Array of pinned repositories
 */
export async function getPinnedRepos(username) {
  try {
    // GitHub GraphQL API endpoint
    const endpoint = 'https://api.github.com/graphql';
    
    // GraphQL query to fetch pinned repositories
    const query = `
      {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                homepageUrl
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
                }
                repositoryTopics(first: 4) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    
    // Make the request to GitHub API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.GITHUB_TOKEN || ''}` // Optional: for higher rate limits
      },
      body: JSON.stringify({ query })
    });
    
    const data = await response.json();
    
    // If there's no GitHub token or we hit rate limits, return fallback data
    if (!data.data || !data.data.user) {
      return getFallbackPinnedRepos(username);
    }
    
    return data.data.user.pinnedItems.nodes;
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return getFallbackPinnedRepos(username);
  }
}

/**
 * Provides fallback data for pinned repositories when API fails
 * @param {string} username - GitHub username
 * @returns {Array} - Array of fallback repositories
 */
function getFallbackPinnedRepos(username) {
  return [
    {
      name: 'sol-trader-bot',
      description: 'High-frequency trading bot for Solana DEXs with advanced order routing and MEV protection.',
      url: `https://github.com/${username}/sol-trader-bot`,
      homepageUrl: null,
      stargazerCount: 42,
      forkCount: 12,
      primaryLanguage: {
        name: 'Rust',
        color: '#B7410E'
      },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'solana' } },
          { topic: { name: 'trading-bot' } },
          { topic: { name: 'defi' } }
        ]
      }
    },
    {
      name: 'anchor-sdk',
      description: 'Developer toolkit for building Solana programs with improved type safety and testing utilities.',
      url: `https://github.com/${username}/anchor-sdk`,
      homepageUrl: null,
      stargazerCount: 38,
      forkCount: 8,
      primaryLanguage: {
        name: 'Rust',
        color: '#B7410E'
      },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'solana' } },
          { topic: { name: 'anchor' } },
          { topic: { name: 'sdk' } }
        ]
      }
    },
    {
      name: 'nft-marketplace',
      description: 'Decentralized NFT marketplace with low fees, creator royalties, and advanced collection analytics.',
      url: `https://github.com/${username}/nft-marketplace`,
      homepageUrl: null,
      stargazerCount: 56,
      forkCount: 15,
      primaryLanguage: {
        name: 'TypeScript',
        color: '#3178c6'
      },
      repositoryTopics: {
        nodes: [
          { topic: { name: 'solana' } },
          { topic: { name: 'nft' } },
          { topic: { name: 'marketplace' } }
        ]
      }
    }
  ];
}
