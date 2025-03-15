import {StyleSheet, View} from 'react-native';
import React from 'react';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';
import SafeAreaWrapper from '../../components/wrappers/SafeAreaWrapper';
import ContentWrap from '../../components/wrappers/ContentWrap';
import NavigationHeader from '../../components/customComponents/headers/NavigationHeader';

import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import MapWithMarkers from '../../components/customComponents/MapWithMarkers';

import {Text} from '../../components/customComponents';
import InfoRow from '../../components/customComponents/InfoRow';
import TravelMethod from '../../components/customComponents/TravelMethod';

const PathDetails = ({route}: any) => {
  const {pathItem, mountainData} = route.params;

  const navigation = useCustomNavigation();

  return (
    <ScrollViewWrapper>
      <SafeAreaWrapper>
        <ContentWrap paddingLeft={20} paddingRight={20} paddingTop={10}>
          <NavigationHeader title={pathItem.pathName} />
          <View
            style={{
              marginTop: 20,
            }}
          />

          <View style={styles.mapContainer}>
            <MapWithMarkers
              flex={1}
              region={mountainData.initialLongLat}
              markers={pathItem.markers}
              draggable={false}
              onNavigate={() =>
                navigation.navigate(routeNames.PathMapView, {
                  pathItem,
                  mountainData,
                })
              }
            />
          </View>

          <View
            style={{
              marginTop: 40,
            }}>
            <Text variant="medium" style={{textAlign: 'center'}}>
              {pathItem.pathDescription}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}>
            <TravelMethod
              iconName="motorbike"
              travelTime={pathItem.travelMethods.bikeMins}
            />
            <TravelMethod
              iconName="car"
              travelTime={pathItem.travelMethods.carMins}
            />
            <TravelMethod
              iconName="bike"
              travelTime={pathItem.travelMethods.bicycleMins}
            />
            <TravelMethod
              iconName="walk"
              travelTime={pathItem.travelMethods.footMins}
            />
          </View>

          <View style={styles.infoContainer}>
            <InfoRow label="Bio Diversity" content={pathItem.bioDiversity} />
            <InfoRow label="Distance" content={pathItem.distance} />
            <InfoRow label="Permission" content={pathItem.permission} />
            <InfoRow label="Special Places" content={pathItem.specialPlaces} />
          </View>
        </ContentWrap>
      </SafeAreaWrapper>
    </ScrollViewWrapper>
  );
};

export default PathDetails;

const styles = StyleSheet.create({
  mapContainer: {
    height: 250,
  },
  infoContainer: {
    marginTop: 20,
    flex: 1,
    marginBottom: 40,
  },
});
