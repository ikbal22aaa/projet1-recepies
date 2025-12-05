// Enhanced Grocery Store Locator with Real API Integration
// This file contains the JavaScript for integrating with real APIs

class GroceryLocatorAPI {
    constructor() {
        this.apiKeys = {
            googleMaps: 'YOUR_GOOGLE_MAPS_API_KEY',
            googlePlaces: 'YOUR_GOOGLE_PLACES_API_KEY',
            openWeather: 'YOUR_OPENWEATHER_API_KEY'
        };
        
        this.baseURLs = {
            googleMaps: 'https://maps.googleapis.com/maps/api',
            googlePlaces: 'https://maps.googleapis.com/maps/api/place',
            openWeather: 'https://api.openweathermap.org/data/2.5'
        };
    }

    // Get user's current location
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    // Search for nearby grocery stores using Google Places API
    async searchNearbyStores(location, radius = 5000, type = 'grocery_or_supermarket') {
        try {
            const response = await fetch(
                `${this.baseURLs.googlePlaces}/nearbysearch/json?` +
                `location=${location.lat},${location.lng}&` +
                `radius=${radius}&` +
                `type=${type}&` +
                `key=${this.apiKeys.googlePlaces}`
            );

            const data = await response.json();
            return data.results.map(place => this.formatStoreData(place, location));
        } catch (error) {
            console.error('Error searching for stores:', error);
            return this.getMockStores(); // Fallback to mock data
        }
    }

    // Format store data from Google Places API
    formatStoreData(place, userLocation) {
        const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
        );

        return {
            id: place.place_id,
            name: place.name,
            address: place.vicinity,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            distance: distance,
            rating: place.rating || 0,
            priceLevel: place.price_level || 0,
            openNow: place.opening_hours ? place.opening_hours.open_now : null,
            photos: place.photos || [],
            types: place.types || []
        };
    }

    // Calculate distance between two points
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Get detailed store information
    async getStoreDetails(placeId) {
        try {
            const response = await fetch(
                `${this.baseURLs.googlePlaces}/details/json?` +
                `place_id=${placeId}&` +
                `fields=name,formatted_address,formatted_phone_number,opening_hours,reviews,photos&` +
                `key=${this.apiKeys.googlePlaces}`
            );

            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error getting store details:', error);
            return null;
        }
    }

    // Search for specific ingredients/products
    async searchIngredients(ingredients, location, radius = 5000) {
        const results = [];
        
        for (const ingredient of ingredients) {
            try {
                // This would integrate with grocery store APIs or web scraping
                const ingredientResults = await this.searchIngredientInStores(ingredient, location, radius);
                results.push({
                    ingredient: ingredient,
                    stores: ingredientResults
                });
            } catch (error) {
                console.error(`Error searching for ${ingredient}:`, error);
            }
        }
        
        return results;
    }

    // Mock function for ingredient search (replace with real API)
    async searchIngredientInStores(ingredient, location, radius) {
        // This would integrate with:
        // - Instacart API
        // - Walmart API
        // - Target API
        // - Kroger API
        // - Or web scraping services
        
        return [
            {
                storeId: 'store1',
                storeName: 'Whole Foods Market',
                price: Math.random() * 10 + 1,
                available: Math.random() > 0.2,
                lastUpdated: new Date().toISOString()
            },
            {
                storeId: 'store2',
                storeName: 'Safeway',
                price: Math.random() * 10 + 1,
                available: Math.random() > 0.2,
                lastUpdated: new Date().toISOString()
            }
        ];
    }

    // Get directions to a store
    async getDirections(origin, destination) {
        try {
            const response = await fetch(
                `${this.baseURLs.googleMaps}/directions/json?` +
                `origin=${origin.lat},${origin.lng}&` +
                `destination=${destination.lat},${destination.lng}&` +
                `key=${this.apiKeys.googleMaps}`
            );

            const data = await response.json();
            return data.routes[0];
        } catch (error) {
            console.error('Error getting directions:', error);
            return null;
        }
    }

    // Get weather information (affects shopping recommendations)
    async getWeatherInfo(location) {
        try {
            const response = await fetch(
                `${this.baseURLs.openWeather}/weather?` +
                `lat=${location.lat}&` +
                `lon=${location.lng}&` +
                `appid=${this.apiKeys.openWeather}&` +
                `units=imperial`
            );

            const data = await response.json();
            return {
                temperature: data.main.temp,
                condition: data.weather[0].main,
                description: data.weather[0].description,
                humidity: data.main.humidity
            };
        } catch (error) {
            console.error('Error getting weather:', error);
            return null;
        }
    }

    // Get store hours and current status
    async getStoreStatus(placeId) {
        try {
            const details = await this.getStoreDetails(placeId);
            if (details && details.opening_hours) {
                return {
                    openNow: details.opening_hours.open_now,
                    periods: details.opening_hours.periods,
                    weekdayText: details.opening_hours.weekday_text
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting store status:', error);
            return null;
        }
    }

    // Price comparison across multiple stores
    async comparePrices(ingredients, stores) {
        const comparison = [];
        
        for (const ingredient of ingredients) {
            const ingredientComparison = {
                ingredient: ingredient,
                stores: []
            };
            
            for (const store of stores) {
                const price = await this.getIngredientPrice(ingredient, store.id);
                ingredientComparison.stores.push({
                    storeId: store.id,
                    storeName: store.name,
                    price: price.price,
                    available: price.available,
                    lastUpdated: price.lastUpdated
                });
            }
            
            // Sort by price
            ingredientComparison.stores.sort((a, b) => a.price - b.price);
            comparison.push(ingredientComparison);
        }
        
        return comparison;
    }

    // Mock function for getting ingredient price (replace with real API)
    async getIngredientPrice(ingredient, storeId) {
        // This would integrate with store APIs or web scraping
        return {
            price: Math.random() * 10 + 1,
            available: Math.random() > 0.1,
            lastUpdated: new Date().toISOString()
        };
    }

    // Get store reviews and ratings
    async getStoreReviews(placeId) {
        try {
            const details = await this.getStoreDetails(placeId);
            return details ? details.reviews : [];
        } catch (error) {
            console.error('Error getting store reviews:', error);
            return [];
        }
    }

    // Find stores with specific features (organic, bulk, etc.)
    async findStoresByFeatures(features, location, radius = 5000) {
        const stores = await this.searchNearbyStores(location, radius);
        
        return stores.filter(store => {
            return features.some(feature => 
                store.types.includes(feature.toLowerCase())
            );
        });
    }

    // Get store photos
    async getStorePhotos(placeId, maxPhotos = 5) {
        try {
            const details = await this.getStoreDetails(placeId);
            if (details && details.photos) {
                return details.photos.slice(0, maxPhotos).map(photo => ({
                    photoReference: photo.photo_reference,
                    url: `${this.baseURLs.googlePlaces}/photo?` +
                         `maxwidth=400&` +
                         `photoreference=${photo.photo_reference}&` +
                         `key=${this.apiKeys.googlePlaces}`
                }));
            }
            return [];
        } catch (error) {
            console.error('Error getting store photos:', error);
            return [];
        }
    }

    // Mock data fallback
    getMockStores() {
        return [
            {
                id: 'mock1',
                name: 'Whole Foods Market',
                address: '123 Main St, Downtown',
                lat: 40.7128,
                lng: -74.0060,
                distance: 0.8,
                rating: 4.2,
                priceLevel: 3,
                openNow: true,
                types: ['grocery_or_supermarket', 'organic']
            },
            {
                id: 'mock2',
                name: 'Safeway',
                address: '456 Oak Ave, Midtown',
                lat: 40.7589,
                lng: -73.9851,
                distance: 1.2,
                rating: 3.8,
                priceLevel: 2,
                openNow: true,
                types: ['grocery_or_supermarket']
            }
        ];
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GroceryLocatorAPI;
}

