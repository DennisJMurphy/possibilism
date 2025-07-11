import { StyleSheet } from 'react-native'

export const groupStyles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  groupCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupDescription: {
    color: 'gray',
    marginTop: 4,
  },
  footerButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  footerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})