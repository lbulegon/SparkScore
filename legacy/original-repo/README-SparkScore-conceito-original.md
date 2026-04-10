# 🔥 SparkScore

**SparkScore** é uma metodologia e uma plataforma de análise semiótica aplicada à comunicação, marketing e performance cultural.  
O projeto nasce para **quantificar a recepção simbólica** de peças gráficas, visuais ou textuais, antecipando **níveis de engajamento, CTR e CTA**, a partir de **unidades mínimas de significação quantificáveis (SparkUnits)**.

---

## 📖 Conceito

O **SparkScore** parte da premissa de que toda mensagem, antes de ser recebida, **gera um Potencial Prévio de Ação (PPA)**.  
Esse potencial pode ser **medido, indexado e previsto** a partir de:

- **SparkUnit** → menor unidade de significação quantificável  
- **Ponto de Ignição** → momento em que a fagulha perceptiva dispara a ação  
- **Irradiação Semiótica** → propagação dos efeitos da mensagem no espaço social  

### Estrutura Conceitual

- **SparkCore** → núcleo metodológico e interpretativo  
- **Orbitais** → dimensões aplicadas de análise (perceptiva, cognitiva, afetiva)  
- **Efeito Zappa** → calibragem do ponto de ignição pelo reconhecimento visual gradual  

---

## 🧩 Metodologia

1. **Análise SKS**  
   Aplicação dos referenciais teóricos (semiótica, psicologia da recepção, métricas digitais) sobre qualquer peça ou estímulo.

2. **SparkUnits**  
   Identificação e quantificação das unidades mínimas de significação.

3. **Indexação em Banco de Dados**  
   - PostgreSQL com extensões **GIN/TRGM**  
   - CIText para normalização de nomes e termos  
   - Estrutura preparada para consultas rápidas e comparativas  

4. **Cálculo de PPA (Potencial Prévio de Ação)**  
   Geração de índices capazes de prever engajamento, CTR e CTA antes da veiculação.

---

## 🛠️ Tecnologias

- **Backend**: Django + Django REST Framework  
- **Banco de Dados**: PostgreSQL (com GIN/TRGM + CIText)  
- **Processamento**: Python (NLTK, spaCy, análise semiótica computacional)  
- **Infraestrutura**: Docker, Railway (deploy rápido)  
- **Camada de IA**: Modelos preparados para RAG e agentes cognitivos  

---

## 📂 Estrutura do Projeto


# ⚡ SparkScore — Estrutura com PreCogs

O SparkScore é um sistema de análise e previsão semiótica que organiza a recepção de peças em camadas.  
Abaixo está a arquitetura completa, incluindo os **PreCogs**, responsáveis por antecipar cenários futuros de ação.

---

## 🔹 1. SparkUnits (PPA – Potencial Prévio de Ação)
- Menores unidades de significação quantificável.  
- Extraem sinais iniciais da peça (cores, formas, CTA, metáforas, microexpressões, etc.).  
- Fornecem o **potencial de ação antes da ação**.

---

## 🔹 2. SparkCore
- Núcleo processador.  
- Organiza, normaliza e calcula índices (CTR antecipado, CTA potencial, intensidade emocional).  
- Prepara a base de dados para projeções.

---

## 🔹 3. Orbitais
- Camadas interpretativas (cognitiva, emocional, cultural).  
- Ajustam os índices ao **contexto de recepção**.  
- Exemplo: a mesma peça pode ter PPA alto em um grupo e baixo em outro.

---

## 🔹 4. PreCogs
- **Módulo preditivo** inspirado em *Minority Report*.  
- Roda simulações com os dados vindos do Core + Orbitais.  
- Entrega uma **antecipação probabilística do ponto de ignição**:
  - Quando ele pode ocorrer.  
  - Qual a intensidade da faísca.  
  - Quão provável é a ativação da ação.

📌 **Saída dos PreCogs = Cenário de ignição projetado.**

---

## 🔹 5. Ponto de Ignição
- **Evento real**: quando a peça gera de fato a ação no mundo.  
- O sistema compara:
  - O que os **PreCogs previram**.  
  - O que **realmente aconteceu**.  
- Essa comparação retroalimenta o sistema e calibra as métricas.

---

## 🔹 6. Irradiação Semiótica
- A expansão do impacto depois do ponto de ignição.  
- Como a ação se espalha, viraliza ou se multiplica.  
- Mede alcance, ressonância e ecos culturais.

---

## 🔗 Fluxograma do Processo

```mermaid
flowchart TD
    A[SparkUnits (PPA)] --> B[SparkCore]
    B --> C[Orbitais]
    C --> D[PreCogs]
    D --> E[Ponto de Ignição]
    E --> F[Irradiação Semiótica]
    D -.->|Projeção| E



---

## 🚀 Roadmap

- [x] Estrutura conceitual inicial (SparkUnit, PPA, Orbitais, SparkCore)  
- [x] Definição das métricas SKS (análise aplicada)  
- [x] Configuração PostgreSQL com GIN/TRGM + CIText  
- [ ] API para ingestão e análise de peças (texto, imagem, vídeo)  
- [ ] Painel visual de métricas (React/Electron)  
- [ ] Integração com modelos de IA (análise multimodal e predição de engajamento)  

---

## 📖 Referenciais Teóricos

- Semiótica de Peirce (diagramas existenciais, primeiridade, secundidade, terceiridade)  
- Greimas (semiótica estrutural e isotopias)  
- Psicologia da recepção (Hume, Santaella, Bergson)  
- Estudos de CTR/CTA no marketing digital  
- Conceito próprio: **PPA – Potencial Prévio de Ação**  

---

## 👥 Autoria e Colaboração

- **Liandro J. Bulegon** – Criador do SparkScore e da metodologia  
- Colaboradores e pesquisadores interessados em semiótica aplicada à performance digital  

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License** – veja o arquivo `LICENSE` para detalhes.
