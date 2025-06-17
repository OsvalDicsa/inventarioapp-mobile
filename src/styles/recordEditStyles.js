import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 16 },
  photo: { width: 200, height: 200, alignSelf: 'center', marginBottom: 20, borderRadius: 8 },
  label: { marginTop: 10, marginBottom: 4, color: colors.dark },
  input: { backgroundColor: colors.white },
  button: { marginTop: 20 }
});
