import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default class HomeScreen extends Component {
  state = {
    articles: [],
    isLoading: true,
    error: null,
    refreshing: false,
    activeCarouselIndex: 0,
  };

  getArticles = () => {
    axios
      .get(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=42f96ae7332147268cf9d2507b5681f2"
      )
      .then(response =>
        response.data.articles.map(article => ({
          date: article.publishedAt,
          title: article.title,
          url: article.url,
          description: article.description,
          urlToImage: article.urlToImage,
          source: article.source.name,
          author: article.author
        }))
      )
      .then(articles => {
        this.setState({
          articles: articles.filter(article => article.urlToImage),
          isLoading: false,
          refreshing: false
        });
      })
      .catch(error => 
        this.setState({ 
          error, 
          isLoading: false, 
          refreshing: false 
        })
      );
  };

  componentDidMount() {
    this.getArticles();
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getArticles();
  };

  formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  onCarouselScroll = (event) => {
    const slideSize = width - 40;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index !== this.state.activeCarouselIndex) {
      this.setState({ activeCarouselIndex: index });
    }
  };

  openArticle = (article) => {
    // Navigate to ArticleDetailScreen and pass the article data as params
    this.props.navigation.navigate('ArticleDetail', { article });
  };

  renderCarouselItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.carouselCard}
        onPress={() => this.openArticle(item)}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.carouselGradient}
        >
          <View style={styles.carouselContent}>
            <View style={styles.carouselMeta}>
              <Text style={styles.carouselSource}>{item.source}</Text>
              <Text style={styles.carouselDate}>{this.formatDate(item.date)}</Text>
            </View>
            <Text style={styles.carouselTitle} numberOfLines={3}>
              {item.title}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  renderCarouselIndicators = () => {
    const featuredArticles = this.state.articles.slice(0, 5);
    
    return (
      <View style={styles.indicatorContainer}>
        {featuredArticles.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === this.state.activeCarouselIndex ? styles.activeIndicator : {}
            ]}
          />
        ))}
      </View>
    );
  };

  renderRegularArticle = (article, index) => {
    return (
      <TouchableOpacity
        key={article.url + '_' + index}
        style={styles.articleCard}
        onPress={() => this.openArticle(article)}
        activeOpacity={0.7}
      >
        <View style={styles.articleContent}>
          <View style={styles.articleTextContainer}>
            <View style={styles.articleMeta}>
              <Text style={styles.articleSource}>{article.source}</Text>
              <Text style={styles.articleDate}>{this.formatDate(article.date)}</Text>
            </View>
            <Text style={styles.articleTitle} numberOfLines={3}>
              {article.title}
            </Text>
            <Text style={styles.articleDescription} numberOfLines={2}>
              {article.description}
            </Text>
          </View>
          <View style={styles.articleImageContainer}>
            <Image
              source={{ uri: article.urlToImage }}
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { isLoading, articles, refreshing, error } = this.state;

    if (error) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          {/* Header with drawer button */}
          <View style={styles.headerWithDrawer}>
            <TouchableOpacity
              style={styles.drawerButton}
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Ionicons name="menu" size={28} color="#1c1c1e" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Latest News</Text>
              <Text style={styles.headerSubtitle}>Stay updated with the latest</Text>
            </View>
          </View>
          
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#ff6b6b" />
            <Text style={styles.errorText}>Failed to load news</Text>
            <TouchableOpacity style={styles.retryButton} onPress={this.getArticles}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const featuredArticles = articles.slice(0, 5);
    const regularArticles = articles.slice(5);

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        {/* Header with drawer button */}
        <View style={styles.headerWithDrawer}>
          <TouchableOpacity
            style={styles.drawerButton}
            onPress={() => this.props.navigation.openDrawer()}
          >
            <Ionicons name="menu" size={28} color="#1c1c1e" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Latest News</Text>
            <Text style={styles.headerSubtitle}>Stay updated with the latest</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading latest news...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
                tintColor="#007AFF"
              />
            }
          >
            {featuredArticles.length > 0 && (
              <>
                <Text style={styles.carouselHeader}>Featured Stories</Text>
                <FlatList
                  data={featuredArticles}
                  renderItem={this.renderCarouselItem}
                  keyExtractor={(item, index) => item.url + '_carousel_' + index}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={width - 40}
                  decelerationRate="fast"
                  contentContainerStyle={styles.carouselContainer}
                  onScroll={this.onCarouselScroll}
                  scrollEventThrottle={16}
                />
                {this.renderCarouselIndicators()}
              </>
            )}
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>More Stories</Text>
            </View>
            
            {regularArticles.map((article, index) => 
              this.renderRegularArticle(article, index)
            )}
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Updated header styles with drawer button
  headerWithDrawer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  drawerButton: {
    padding: 8,
    marginRight: 15,
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1c1e',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#8e8e93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#1c1c1e',
    marginTop: 15,
    marginBottom: 25,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Carousel Styles
  carouselHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1c1c1e',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  carouselContainer: {
    paddingHorizontal: 20,
  },
  carouselCard: {
    width: width - 40,
    height: 280,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: 'flex-end',
  },
  carouselContent: {
    padding: 20,
  },
  carouselMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carouselSource: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
    textTransform: 'uppercase',
  },
  carouselDate: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 8,
    opacity: 0.7,
  },
  carouselTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },

  // Indicator Styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d1d6',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 24,
    borderRadius: 4,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  articleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  articleContent: {
    flexDirection: 'row',
  },
  articleTextContainer: {
    flex: 2,
    paddingRight: 15,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
  },
  articleDate: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 8,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1c1c1e',
    lineHeight: 23,
    marginBottom: 8,
  },
  articleDescription: {
    fontSize: 15,
    color: '#636366',
    lineHeight: 20,
  },
  articleImageContainer: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 85,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 30,
  },
};