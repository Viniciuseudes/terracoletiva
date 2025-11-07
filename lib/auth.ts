// lib/auth.ts
"use client"; // Necessário para interagir com localStorage/Supabase no cliente

import { supabase } from './supabaseClient';
import type { AuthError, SignUpWithPasswordCredentials, User as SupabaseAuthUser } from '@supabase/supabase-js';

// Define um tipo mais completo para o nosso usuário, incluindo dados do perfil
export interface UserProfile extends SupabaseAuthUser {
  // Adicionamos as propriedades da sua tabela 'profiles'
  full_name?: string;
  user_type?: 'producer' | 'seller' | 'admin'; // Ajuste 'admin' se necessário
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

/**
 * Realiza o login do usuário com email e senha usando Supabase Auth.
 * Retorna os dados do usuário ou null em caso de falha.
 * Lança um erro em caso de falha na autenticação.
 */
export async function login(email: string, password: string): Promise<SupabaseAuthUser | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Erro no login:', error.message);
    throw error; // Lança o erro para ser tratado na página de login
  }

  return data.user;
}

/**
 * Realiza o cadastro de um novo usuário.
 * Cria o usuário na autenticação e insere o perfil na tabela 'profiles'.
 */
export async function signUp(credentials: SignUpWithPasswordCredentials, profileData: { full_name: string; user_type: 'producer' | 'seller'; phone?: string }): Promise<{ user: SupabaseAuthUser | null, error: AuthError | null }> {
  // 1. Cadastra o usuário na autenticação do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp(credentials);

  if (authError || !authData.user) {
    console.error('Erro no cadastro (Auth):', authError?.message);
    return { user: null, error: authError };
  }

  // 2. Insere os dados adicionais na tabela 'profiles'
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id, // Vincula o perfil ao usuário autenticado
      full_name: profileData.full_name,
      user_type: profileData.user_type,
      phone: profileData.phone,
      // Adicione outros campos padrão se necessário (city, state, etc.)
    });

  if (profileError) {
    console.error('Erro ao inserir perfil:', profileError.message);
    // Aqui você pode querer adicionar lógica para lidar com falha no perfil
    // Por exemplo, deletar o usuário recém-criado na autenticação
    // await supabase.auth.admin.deleteUser(authData.user.id); // Requer chave de admin no backend
    return { user: authData.user, error: { name: 'ProfileError', message: profileError.message } as AuthError };
  }

  return { user: authData.user, error: null };
}


/**
 * Realiza o logout do usuário atual.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro no logout:', error.message);
  }
  // Limpar localStorage ou state global se necessário (embora o Supabase gerencie a sessão)
}

/**
 * Obtém os dados do usuário autenticado ATUALMENTE na sessão.
 * Nota: Para saber QUANDO o estado muda (login/logout), use onAuthStateChange.
 */
export async function getCurrentUserSession(): Promise<SupabaseAuthUser | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Erro ao obter sessão:", error.message);
    return null;
  }
  return data.session?.user ?? null;
}

/**
 * Obtém os dados completos do perfil do usuário logado (da tabela 'profiles').
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUserSession();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single(); // Espera apenas um resultado

  if (error) {
    console.error('Erro ao buscar perfil:', error.message);
    // Retorna os dados básicos do auth se o perfil não for encontrado
    return { ...user, full_name: 'Usuário', user_type: undefined };
  }

  // Combina dados da autenticação com dados do perfil
  return data ? { ...user, ...data } : { ...user, full_name: 'Usuário', user_type: undefined };
}

/**
 * Escuta mudanças no estado de autenticação (login, logout).
 * Ideal para usar em um layout principal ou contexto global.
 *
 * @param callback Função a ser executada quando o estado de auth mudar.
 * @returns Função para cancelar a inscrição do listener.
 */
export function onAuthStateChange(callback: (user: SupabaseAuthUser | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => {
    subscription?.unsubscribe();
  };
}