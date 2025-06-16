import { StyleSheet } from 'react-native';
import { colors } from '../theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  loading: { marginTop: 20, textAlign: 'center', color: colors.dark },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 10,
    padding: 10,
    elevation: 1,
    alignItems: 'center'
  },
  photo: { width: 60, height: 60, marginRight: 10, borderRadius: 4 },
  info: { flex: 1 },
  text: { color: colors.dark },
  actions: { justifyContent: 'space-between' },
  button: { padding: 6 },
  buttonText: { color: colors.primary }
});
