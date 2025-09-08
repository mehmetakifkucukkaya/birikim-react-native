import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text h3>Birikim</Text>
            <View style={styles.spacer} />
            <Button title="Yatırım Ekle" onPress={() => navigation.navigate('AddInvestment')} />
            <View style={styles.spacer} />
            <Button type="outline" title="Portföy" onPress={() => navigation.navigate('Portfolio')} />
            <View style={styles.spacer} />
            <Button type="outline" title="Geçmiş" onPress={() => navigation.navigate('History')} />
            <View style={styles.spacer} />
            <Button type="clear" title="Ayarlar" onPress={() => navigation.navigate('Settings')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    spacer: { height: 12 },
});

export default HomeScreen;


