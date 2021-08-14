const fallbackNoOps = {
    getItem(t: string) {
        return ''
    },
    setItem(t: string, v: string) {},
}
const localStorage = window.localStorage ? window.localStorage : fallbackNoOps
const sessionStorage = window.sessionStorage
    ? window.sessionStorage
    : fallbackNoOps

const AUTH_KEY = 'ADMIN_AUTH_KEY'
const SIDER_COLLAPSED_STATE = 'ADMIN_SIDER_COLLAPSED_STATE'
const DARK_MODE = 'ADMIN_DARK_MODE'
const ADMIN_STATE = 'ADMIN_ADMIN'

class StorageHelper {
    getAuthKeyFromStorage() {
        const localStorageAuth = localStorage.getItem(AUTH_KEY)
        return localStorageAuth
            ? localStorageAuth
            : sessionStorage.getItem(AUTH_KEY) || ''
    }

    clearAuthKeys() {
        localStorage.setItem(AUTH_KEY, '')
        sessionStorage.setItem(AUTH_KEY, '')
    }

    setAuthKeyInSessionStorage(authKey: string) {
        sessionStorage.setItem(AUTH_KEY, authKey)
        localStorage.setItem(AUTH_KEY, '')
    }

    setAuthKeyInLocalStorage(authKey: string) {
        localStorage.setItem(AUTH_KEY, authKey)
        sessionStorage.setItem(AUTH_KEY, '')
    }

    setSiderCollapsedStateInLocalStorage(siderCollapsed: boolean) {
        localStorage.setItem(
            SIDER_COLLAPSED_STATE,
            JSON.stringify(siderCollapsed)
        )
    }

    setAdmin(isAdmin: boolean) {
        localStorage.setItem(ADMIN_STATE, JSON.stringify(isAdmin))
    }

    isAdmin(): boolean {
        const storageValue = localStorage.getItem(ADMIN_STATE)
        return storageValue && JSON.parse(storageValue)
    }

    getSiderCollapsedStateFromLocalStorage(): boolean {
        const storageValue = localStorage.getItem(SIDER_COLLAPSED_STATE)
        return storageValue && JSON.parse(storageValue)
    }

    setDarkModeInLocalStorage(isDarkMode: boolean) {
        localStorage.setItem(DARK_MODE, JSON.stringify(isDarkMode))
    }

    getDarkModeFromLocalStorage(): boolean {
        const isDarkMode = localStorage.getItem(DARK_MODE)
        // If not preference exists, return DarkMode based on users colorScheme
        return isDarkMode
            ? JSON.parse(isDarkMode)
            : window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches
    }
}

const instance = new StorageHelper()
export default instance
