'use client'

import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Upload from './components/Upload'
import TestConfig from './components/TestConfig'
import TestTaking from './components/TestTaking'
import Summary from './components/Summary'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">COURSEDRILLER</h1>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/upload" component={Upload} />
            <PrivateRoute path="/test-config" component={TestConfig} />
            <PrivateRoute path="/test-taking" component={TestTaking} />
            <PrivateRoute path="/summary" component={Summary} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  )
}

function PrivateRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useAuth()
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  )
}

export default App