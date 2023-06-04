import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    border: '1px solid lightgray',
    background: '#f5f5f5',
  },
  headerText: {
    marginLeft: theme.spacing(2),
  },
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media: {
    height: 240,
  },
  featureContainer: {
    flexGrow: 1, // Allow the feature to take up remaining vertical space
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  featureText: {
    fontSize: '1.2rem',
    textAlign: 'center',
  },
  featureImage: {
    width: 400,
    height: 400,
    marginLeft: theme.spacing(20),
  },
}));

const LandingPage = () => {
  const classes = useStyles();

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
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <img src="your-logo-image-url" alt="Logo" height="60" />
        <Typography variant="h4" className={classes.headerText}>
          PolyEstate
        </Typography>
      </div>
      <Typography variant="h6" align="center" gutterBottom>
        Revolutionizing Real Estate with Secure, Transparent, and ZK-Private Transactions
      </Typography>
      <Grid container justify="center">
        {nftData.map((nft) => (
          <Card key={nft.id} className={classes.card}>
            <CardMedia
              className={classes.media}
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
        <div key={feature.id} className={classes.featureContainer}>
          <div>
            <Typography variant="h6" component="h3" className={classes.featureText}>
              {feature.title}
            </Typography>
            <Typography variant="body2" component="p" className={classes.featureText}>
              {feature.description}
            </Typography>
          </div>
          <img src={feature.image} alt={feature.title} className={classes.featureImage} />
        </div>
      ))}
    </div>
  );
};

export default LandingPage;

