import React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import styles from '../styles/Landing.module.css';

const LandingPage = () => {
  const nftData = [
    {
      id: 1,
      title: 'Example NFT 1',
      image: 'https://www.marketing91.com/wp-content/uploads/2019/06/Most-Expensive-Homes.jpg',
      description: 'We gonna buy it soon. (Hahaha)',
    },
    {
      id: 2,
      title: 'Example NFT 2',
      image: 'https://assets.gqindia.com/photos/5e68bdd57e91b400088980c0/16:9/pass/most-expensive-homes.jpg',
      description: 'We gonna buy it soon.  (Hahaha)',
    },

    {
      id: 2,
      title: 'Example NFT 2',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6v3tWT_9k77Ri9VcnKpguQo4IeJvlsdv6QA&usqp=CAU',
      description: 'We gonna buy it soon. (Hahaha)',
    },

    {
      id: 2,
      title: 'Example NFT 2',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPsZknv8uxFFCtHBOA2S2sA_t2Cz0vWp9aCg&usqp=CAU',
      description: 'We gonna buy it soon. (Hahaha',
    },

    {
      id: 2,
      title: 'Example NFT 2',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS1DNfw0cBqoqgULIOxEkCL2CLKtGsQ0yElw&usqp=CAU',
      description: 'We gonna buy it soon. (Hahaha)',
    },

  ];

  const features = [
    {
      id: 1,
      title: 'TrustLess',
      description: '',
      image: 'https://gainx.vercel.app/_next/image?url=%2Fimages%2Fcontent%2Fgameplay%2F3.png&w=640&q=100',
    },
    {
      id: 2,
      title: 'Secure',
      description: '',
      image: 'https://gainx.vercel.app/_next/image?url=%2Fimages%2Fcontent%2Fgameplay%2F4.png&w=640&q=100',
    },
    {
      id: 3,
      title: 'Privacy',
      description: '',
      image: 'https://gainx.vercel.app/_next/image?url=%2Fimages%2Fcontent%2Fgameplay%2F5.png&w=640&q=100',
    },
    // Add more features as needed
  ];

  return (
    <div className={styles.main}>
      <div className={styles.headerContainer}>
        <img src="your-logo-image-url" alt="Logo" height="60" />
        <Typography variant="h4" className={styles.headerText}>
          PolyEstate
        </Typography>
      </div>
      <Typography variant="h6" align="center" gutterBottom>
        Revolutionizing Real Estate with Secure, Transparent, and ZK-Private Transactions
      </Typography>
      <Grid container justify="center">
        {nftData.map((nft) => (
          <Card key={nft.id} className={styles.card}>
            <CardMedia
              className={styles.media}
              image={nft.image}
              title={nft.title}
            />
            <CardContent>
            <Typography variant="h6" component="h2">
                {nft.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                {nft.description.substring(0, nft.description.length / 2)}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" align="center">
                {nft.description.substring(nft.description.length / 2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {features.map((feature) => (
        <div key={feature.id} className={styles.featureContainer}>
          <div>
            <Typography variant="h6" component="h3" className={styles.featureText}>
              {feature.title}
            </Typography>
            <Typography variant="body2" component="p" className={styles.featureText}>
              {feature.description}
            </Typography>
          </div>
          <img src={feature.image} alt={feature.title} className={styles.featureImage} />
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
