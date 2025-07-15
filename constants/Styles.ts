import { StyleSheet } from 'react-native'

export const groupStyles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
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
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
  },
  groupDescription: {
    marginTop: 4,
  },
  footerButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
  },
  footerButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginBottom: 30,
    padding: 12,
    borderRadius: 8,
  },
})

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 6,
  },
  button: {
    marginBottom: 10,
  },
  message: {
    marginTop: 20,
    fontSize: 14,
  },
})
