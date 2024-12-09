import {FlatList, StyleSheet, ToastAndroid, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';

import HomeHeader from '../../components/customComponents/headers/HomeHeader';
import ContentWrap from '../../components/wrappers/ContentWrap';
import {Text} from '../../components/customComponents';

import {colors} from '../../theme/colors';
import {ActivityIndicator} from 'react-native-paper';
import MountainCard from '../../components/customComponents/MountainCard';
import SafeAreaWrapper from '../../components/wrappers/SafeAreaWrapper';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import firestore from '@react-native-firebase/firestore';
import {Mountain} from '../../types/mountainTypes';
import MountainCarousel from '../../components/customComponents/MountainCarousel';
import HomeCarouselItem from '../../components/HomeCarouselItem';
import ContainedButton from '../../components/customComponents/ContainedButton';

// {
//   mountainId:"1"
//   mountainName:"Knuckles",
//   mainImage:"https://i.postimg.cc/8kWgngyb/pexels-alexazabache-3723035.jpg",
//   mountainDescription:"Trekking the Knuckles Mountain Range is an unforgettable experience, offering one of the best backpacking escapes.",
//   carouselImages:["https://i.postimg.cc/WpG5BZvQ/d94c312ceb8ca8f02fe59ff6e14a984a.jpg","https://i.postimg.cc/BvRh0ctG/R-1.jpg"]
//   initialLongLat:{
//     latitude: 7.402632,
//     longitude: 80.808842,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   },
//   paths:[{
//     pathId:"p1"
//     pathName:"Dothalugala Nature Trail",
//     pathDescription:"A popular trail to Dothalugala Mountain, one of the 34 peaks in the Knuckles Range, offering stunning panoramic views of the southern end.",
//     travelMethods:{
//       carMins:30,
//       bikeMins:20,
//       footMins:50,
//       bicycleMins:1
//     },
//     bioDiversity:"",
//     distance:"",
//     permission:"",
//     specialPlaces:"",
//     markers:[
//       {latitude: 7.402632, longitude: 80.808842},
//       {latitude: 7.400771, longitude: 80.810616},
//       {latitude: 7.399366, longitude: 80.809972},
//     ]
//   }]
// }

const addMountainData = async () => {
  const mountainData = {
    mountainId: '4',
    mountainName: "Adam's Peak (Sri Pada)",
    mainImage: 'https://i.postimg.cc/SxyP0zcZ/AdamsPek.jpg',
    mountainDescription:
      "Adam's Peak (Sri Pada) is one of the most sacred and famous mountains in Sri Lanka, renowned for its spiritual significance and breathtaking sunrise views.",
    carouselImages: [
      'https://i.postimg.cc/Ghcpfqg6/a1.jpg',
      'https://i.postimg.cc/QNgtSRmp/a2.jpg',
      'https://i.postimg.cc/D0cwZX0C/r3.jpg',
    ],
    initialLongLat: {
      latitude: 6.8154,
      longitude: 80.3815,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    endPoint: {
      latitude: 6.8105,
      longitude: 80.3745,
    },
    paths: [
      {
        pathId: 'p1',
        pathName: "Sri Pada (Adam's Peak) Pilgrimage Path",
        pathDescription:
          "The main trail leading to the summit of Adam's Peak. This popular pilgrimage path is frequented by pilgrims and hikers alike, offering a spiritual experience and spectacular views, especially during sunrise.",
        travelMethods: {
          carMins: 60,
          bikeMins: 45,
          footMins: 120,
          bicycleMins: 60,
        },
        bioDiversity:
          'The trail is surrounded by lush forest, home to a variety of endemic plants and animals.',
        distance: '8 km (one way)',
        permission: 'No specific permit required for the pilgrimage route.',
        specialPlaces:
          'The summit has a sacred footprint, considered to be the footprint of Lord Buddha, Shiva, or Adam, depending on the religion.',
        markers: [
          {latitude: 6.8154, longitude: 80.3815},
          {latitude: 6.8165, longitude: 80.383},
          {latitude: 6.818, longitude: 80.386},
          {latitude: 6.82, longitude: 80.389},
        ],
      },
      {
        pathId: 'p2',
        pathName: "Off-the-Beaten-Path Trail to Adam's Peak",
        pathDescription:
          "A less crowded and more challenging trail leading to Adam's Peak, passing through dense jungle and offering a more remote experience for adventurous hikers.",
        travelMethods: {
          carMins: 60,
          bikeMins: 45,
          footMins: 150,
          bicycleMins: 80,
        },
        bioDiversity:
          'This trail passes through more diverse ecosystems, including tropical forests, streams, and wildlife habitats.',
        distance: '9 km (one way)',
        permission:
          'Permit is required from local authorities for this trail as it passes through protected areas.',
        specialPlaces:
          'The trail offers opportunities to spot rare wildlife, including endemic bird species and monkeys.',
        markers: [
          {latitude: 6.8154, longitude: 80.3815},
          {latitude: 6.812, longitude: 80.379},
          {latitude: 6.81, longitude: 80.3765},
          {latitude: 6.8105, longitude: 80.3745},
        ],
      },
    ],
  };
  try {
    // Add the document with `mountainId` as the document ID
    await firestore()
      .collection('mountains')
      .doc(mountainData.mountainId) // Use `mountainId` as the document ID
      .set(mountainData);
    console.log('Mountain data added successfully!');
  } catch (error) {
    console.error('Error adding mountain data: ', error);
  }
};
const HomeScreen = () => {
  const navigation = useCustomNavigation();

  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch mountain data from Firestore when the component mounts or is refreshed
  const fetchMountainsData = async () => {
    try {
      const snapshot = await firestore().collection('mountains').get();
      console.log('DDd', snapshot.docs);
      if (snapshot.empty) {
        console.log('No mountains data available.');
      } else {
        // Map the fetched documents to an array of mountain data
        const mountainsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        //@ts-ignore
        setMountains(mountainsData);
      }
    } catch (err) {
      ToastAndroid.show('An error has occurred', 3000);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Effect to fetch data when the component is mounted
  useEffect(() => {
    setLoading(true);
    fetchMountainsData();
  }, []);

  // Handle the pull-to-refresh action
  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await fetchMountainsData();
  };
  const renderItem = ({
    item,
  }: {
    item: {mountainName: string; mainImage: string};
  }) => <HomeCarouselItem item={item} />;

  return (
    <ScrollViewWrapper isScrollable={false}>
      <SafeAreaWrapper>
        <ContentWrap paddingLeft={16} paddingRight={16} paddingTop={16}>
          <HomeHeader />
          {/* <ContainedButton label="Add mountain" onPress={addMountainData} /> */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 38,
            }}>
            <Text variant="medium" fontSize={17}>
              Select Your Mountain
            </Text>
          </View>
          <View style={{alignItems: 'center', overflow: 'hidden', height: 200}}>
            {loading ? (
              <View
                style={{
                  height: 200,
                  justifyContent: 'center',
                }}>
                <ActivityIndicator />
              </View>
            ) : (
              <MountainCarousel mountains={mountains} renderItem={renderItem} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text variant="medium" fontSize={15}>
              Most Popular Mountains{' '}
            </Text>
            <Text
              variant="semiBold"
              fontSize={13}
              style={{
                color: colors.primaryGreen,
              }}>
              See more
            </Text>
          </View>
          {loading ? (
            <View
              style={{
                height: 200,
                justifyContent: 'center',
              }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={mountains}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              renderItem={({item}) => (
                <MountainCard
                  onPress={() =>
                    navigation.navigate(routeNames.MountainDetails, {
                      mountainData: item,
                    })
                  }
                  imageUri={item.mainImage}
                  description={item.mountainDescription}
                  mountainName={`${item.mountainName} Mountain`}
                  containerStyle={{
                    marginLeft: 3,
                    marginRight: 3,
                  }}
                />
              )}
            />
          )}
        </ContentWrap>
      </SafeAreaWrapper>
    </ScrollViewWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
