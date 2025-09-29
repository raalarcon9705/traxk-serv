# Sistema de Monedas y Centavos

## Resumen

La aplicación TrackServ ha sido actualizada para almacenar todos los montos monetarios en **centavos** (como enteros) en lugar de decimales. Esto mejora la precisión y evita errores de punto flotante.

## Cambios Realizados

### 1. Base de Datos
- **Migración**: `20250929180000_convert_amounts_to_cents.sql`
- **Columnas afectadas**:
  - `services.amount` - ahora en centavos (BIGINT)
  - `services.commission_amount` - ahora en centavos (BIGINT) 
  - `services.net_amount` - ahora en centavos (BIGINT)
  - `services.tip_amount` - ahora en centavos (BIGINT)
  - `payment_periods.total_amount` - ahora en centavos (BIGINT)
  - `payment_periods.total_commission` - ahora en centavos (BIGINT)
  - `payment_periods.total_net_amount` - ahora en centavos (BIGINT)

### 2. Hook `useCurrency.ts`

#### Nuevas Funciones:
- `formatCurrency(amountInCents: number)` - Formatea centavos usando `Intl.NumberFormat`
- `toCents(decimalAmount: number)` - Convierte decimal a centavos
- `fromCents(amountInCents: number)` - Convierte centavos a decimal

#### Formateo Internacional:
```typescript
// Ejemplos de formateo por idioma/moneda:
formatCurrency(10000) // 10000 centavos = $100.00

// Portugués (Brasil) + BRL: "R$ 100,00"
// Español (España) + EUR: "100,00 €"  
// Inglés (US) + USD: "$100.00"
```

### 3. Mapeo de Locales:
```typescript
const localeMap = {
  'pt': 'pt-BR', // Portugués (Brasil)
  'es': 'es-ES', // Español (España)
  'en': 'en-US'  // Inglés (Estados Unidos)
}
```

## Uso en Componentes

### Mostrar Montos:
```typescript
const { formatCurrency } = useCurrency()

// Los montos vienen de la BD en centavos
const service = { amount: 10000 } // 10000 centavos = $100.00

return <div>{formatCurrency(service.amount)}</div>
```

### Crear Servicios:
```typescript
const { toCents } = useCurrency()

// El usuario ingresa $25.50
const userInput = 25.50

// Convertir a centavos antes de guardar
const amountInCents = toCents(userInput) // 2550 centavos

await createService({
  amount: amountInCents, // Se guarda como 2550
  // ...otros campos
})
```

### Cálculos:
```typescript
const { fromCents, toCents, formatCurrency } = useCurrency()

// Datos de la BD (en centavos)
const service = {
  amount: 10000,      // $100.00
  tip_amount: 500     // $5.00
}

// Para cálculos, convertir a decimal
const totalDecimal = fromCents(service.amount) + fromCents(service.tip_amount)
// totalDecimal = 100.00 + 5.00 = 105.00

// Mostrar resultado
const totalInCents = toCents(totalDecimal) // 10500 centavos
return <div>Total: {formatCurrency(totalInCents)}</div>
```

## Ventajas del Sistema

1. **Precisión**: No hay errores de punto flotante
2. **Internacionalización**: Formato automático según idioma/moneda
3. **Consistencia**: Todos los montos se manejan igual
4. **Performance**: Operaciones con enteros son más rápidas

## Migración de Datos

La migración convierte automáticamente:
- Montos existentes × 100 → centavos
- Tipos de columnas: `DECIMAL` → `BIGINT`
- Tasa de comisión: decimal (0.15) → porcentaje (15)

## Ejemplo Completo

```typescript
// Componente que muestra un servicio
export function ServiceCard({ service }: { service: Service }) {
  const { formatCurrency } = useCurrency()
  
  return (
    <div>
      <p>Monto: {formatCurrency(service.amount)}</p>
      <p>Comisión: {formatCurrency(service.commission_amount)}</p>  
      <p>Neto: {formatCurrency(service.net_amount)}</p>
      {service.tip_amount && (
        <p>Gorjeta: {formatCurrency(service.tip_amount)}</p>
      )}
    </div>
  )
}
```

## Notas Importantes

- **Siempre** usar `toCents()` antes de guardar en BD
- **Siempre** usar `formatCurrency()` para mostrar montos
- Los cálculos complejos pueden usar `fromCents()` y luego `toCents()`
- El sistema fallback funciona si `Intl.NumberFormat` falla
