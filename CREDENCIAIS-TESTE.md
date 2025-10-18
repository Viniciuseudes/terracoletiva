# Credenciais de Teste - Terra Coletiva RN

## 👨‍🌾 Conta de Produtor

**Email:** produtor@terracoletiva.com.br  
**Senha:** produtor123

**Perfil:**
- Nome: João Silva
- Tipo: Produtor Rural
- Localização: Mossoró, RN
- Acesso: Dashboard do Produtor

---

## 🏪 Conta de Vendedor

**Email:** vendedor@terracoletiva.com.br  
**Senha:** vendedor123

**Perfil:**
- Nome: Maria Santos
- Tipo: Vendedor/Fornecedor
- Empresa: Agro Suprimentos RN
- Acesso: Dashboard do Vendedor

---

## 👨‍💼 Conta de Administrador

**Email:** admin@terracoletiva.com.br  
**Senha:** admin123

**Perfil:**
- Nome: Administrador
- Tipo: Administrador da Plataforma
- Acesso: Painel Administrativo Completo
- Permissões: Gerenciar usuários, negociações e vendas

---

## 📝 Notas Importantes

- Estas são credenciais de **demonstração** apenas
- Atualmente o sistema usa dados mockados (não há autenticação real)
- Para implementar autenticação real, conecte a integração Supabase
- Os scripts SQL em `/scripts` criarão as tabelas necessárias quando executados

## 🚀 Como Testar

1. Acesse a página inicial em `/`
2. Clique em "Entrar" no menu
3. Use as credenciais acima conforme o tipo de usuário que deseja testar
4. Explore os dashboards específicos:
   - Produtor: `/produtor`
   - Vendedor: `/vendedor`
   - Administrador: `/admin`

## 🔐 Próximos Passos para Autenticação Real

1. Conecte a integração Supabase no painel lateral
2. Execute os scripts SQL em `/scripts` para criar as tabelas
3. Configure as políticas RLS (Row Level Security)
4. Implemente os hooks de autenticação do Supabase
